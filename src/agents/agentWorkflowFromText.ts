import { Request, Response } from "express";
import { workflowGenerateTool } from "../tools/n8n/workflowGenerate.js";
import { createGitHubIssueTool } from "../tools/github/createIssue.js";
import { callOpenAI } from "../services/openai.js";
import { McpToolRequest } from "../types/mcp.js";

/**
 * The agent now accepts two types of input:
 * - Free text (for decision and generation)
 * - Structured payload (when forwarding to a tool)
 */
type AgentInput =
  | { text: string }
  | {
    owner: string;
    repo: string;
    title: string;
    body?: string;
    labels?: string[];
  };

export async function agentWorkflowFromText(
  req: Request<{}, {}, McpToolRequest<AgentInput>>,
  res: Response
) {
  try {
    const { input } = req.body || {};

    // 🔐 Correct type guard to access `text`
    const text =
      input && typeof input === "object" && "text" in input
        ? input.text
        : undefined;

    if (!text) {
      return res.status(400).json({
        error: "text is required",
      });
    }

    // 🔎 0️⃣ Detects GitHub Issue intent
    const isGithubIssueIntent =
      /criar issue|crie uma issue|abrir issue|issue no github/i.test(text);

    // ============================
    // 🐙 GITHUB ISSUE FLOW
    // ============================
    if (isGithubIssueIntent) {
      const payload = {
        owner: "Camiloruas",
        repo: "mcp-server-integration",
        title: text.slice(0, 80),
        body: text,
        labels: ["mcp"],
      };

      // Reuses MCP pattern: adapts body for the tool
      req.body.input = payload;

      // The tool assumes its contract from here
      // @ts-ignore – runtime is valid (Express)
      return createGitHubIssueTool(req, res);
    }

    // ============================
    // 🔁 N8N WORKFLOW FLOW
    // ============================

    const systemPrompt = `
You are an n8n workflow architect.
Generate ONLY valid JSON.
Never explain anything.
Format:
{
  "name": "...",
  "nodes": [...],
  "connections": {...}
}
`;

    const aiResponse = await callOpenAI({
      system: systemPrompt,
      user: text,
    });

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    let workflowJson;
    try {
      workflowJson = JSON.parse(aiResponse);
    } catch {
      throw new Error("GPT returned invalid JSON");
    }

    req.body.input = workflowJson;

    // @ts-ignore – direct delegation to the tool
    return workflowGenerateTool(req, res);
  } catch (err) {
    console.error("agentWorkflowFromText error:", err);

    return res.status(500).json({
      error: (err as Error).message,
    });
  }
}
