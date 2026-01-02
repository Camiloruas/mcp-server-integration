import { Request, Response } from "express";
import { workflowGenerateTool } from "./workflowGenerate.js";
import { callOpenAI } from "../services/openai.js";
import { McpToolRequest } from "../types/mcp.js";

interface AgentInput {
  text: string;
}

export async function agentWorkflowFromText(req: Request<{}, {}, McpToolRequest<AgentInput>>, res: Response) {
  try {
    const { input } = req.body || {};
    const text = input?.text;

    if (!text) {
      return res.status(400).json({
        error: "text is required"
      });
    }

    // 1️⃣ Prompt fixo do agente
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

    // 2️⃣ Chamada ao GPT
    const aiResponse = await callOpenAI({
      system: systemPrompt,
      user: text
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

    // 3️⃣ Reencaminha para a tool real
    // Como estamos reutilizando a função, precisamos adaptar o body para corresponder ao contrato de workflowGenerate
    req.body.input = workflowJson;

    // TypeScript pode reclamar aqui porque estamos "enganando" o compilador ao mudar o body
    // Mas em runtime (Express) é válido.
    // @ts-ignore
    return workflowGenerateTool(req, res);
  } catch (err) {
    console.error("agentWorkflowFromText error:", err);

    return res.status(500).json({
      error: (err as Error).message
    });
  }
}
