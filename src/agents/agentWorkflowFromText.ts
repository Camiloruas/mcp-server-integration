import { Request, Response } from "express";
import { workflowGenerateTool } from "../tools/n8n/workflowGenerate.js";
import { createGitHubIssueTool } from "../tools/github/createIssue.js";
import { callOpenAI } from "../services/openai.js";
import { McpToolRequest } from "../types/mcp.js";

/**
 * O agent agora aceita dois tipos de input:
 * - Texto livre (para decisão e geração)
 * - Payload estruturado (quando ele reencaminha para uma tool)
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

    // 🔐 Type guard correto para acessar `text`
    const text =
      input && typeof input === "object" && "text" in input
        ? input.text
        : undefined;

    if (!text) {
      return res.status(400).json({
        error: "text is required",
      });
    }

    // 🔎 0️⃣ Detecta intenção GitHub Issue
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

      // Reaproveita o padrão do MCP: adapta o body para a tool
      req.body.input = payload;

      // A tool assume o contrato dela a partir daqui
      // @ts-ignore – runtime é válido (Express)
      return createGitHubIssueTool(req, res);
    }

    // ============================
    // 🔁 N8N WORKFLOW FLOW
    // ============================

    const systemPrompt = `
Você é um arquiteto de workflows do n8n.
Gere APENAS JSON válido.
Nunca explique nada.
Formato:
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

    // @ts-ignore – delegação direta para a tool
    return workflowGenerateTool(req, res);
  } catch (err) {
    console.error("agentWorkflowFromText error:", err);

    return res.status(500).json({
      error: (err as Error).message,
    });
  }
}
