import { workflowGenerateTool } from "./workflowGenerate.js";
import { callOpenAI } from "../services/openai.js";

export async function agentWorkflowFromText(req, res) {
  try {
    const { text } = req.body || {};

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

    let workflowJson;
    try {
      workflowJson = JSON.parse(aiResponse);
    } catch {
      throw new Error("GPT returned invalid JSON");
    }

    // 3️⃣ Reencaminha para a tool real
    req.body.input = workflowJson;

    return workflowGenerateTool(req, res);
  } catch (err) {
    console.error("agentWorkflowFromText error:", err);

    return res.status(500).json({
      error: err.message
    });
  }
}
