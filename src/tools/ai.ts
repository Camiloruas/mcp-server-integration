import { Request, Response } from "express";
import OpenAI from "openai";
import { McpToolRequest } from "../types/mcp.js";

interface AiInput {
  prompt: string;
}

function getOpenAIClient(): OpenAI | null {
  if (process.env.AI_MODE !== "openai") return null;

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000, //  30 segundos
  });
}

function mockResponse(prompt: string, reason = "mock") {
  return {
    tool: "ai",
    status: "ok",
    mode: "mock",
    fallback: true,
    reason,
    prompt,
    response: "IA mock funcionando",
  };
}

async function callOpenAIWithRetry(client: OpenAI, payload: any, retries = 1): Promise<any> {
  try {
    return await client.chat.completions.create(payload);
  } catch (error) {
    if (retries > 0) {
      console.warn("OpenAI timeout/error, retrying once...");
      return callOpenAIWithRetry(client, payload, retries - 1);
    }
    throw error;
  }
}

export async function aiTool(req: Request<{}, {}, McpToolRequest<AiInput>>, res: Response) {
  const { input } = req.body || {};
  const prompt = input?.prompt;

  if (!prompt) {
    return res.status(400).json({
      error: "Missing 'prompt'",
    });
  }

  /* MOCK FORÇADO */
  if (process.env.AI_MODE !== "openai") {
    return res.json({
      tool: "ai",
      status: "ok",
      mode: "mock",
      fallback: false,
      prompt,
      response: "IA mock funcionando",
    });
  }

  /* OPENAI COM TIMEOUT + RETRY + FALLBACK */
  try {
    const client = getOpenAIClient();
    if (!client) throw new Error("Client initialization failed");

    const payload = {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um assistente técnico e objetivo." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    };

    const completion = await callOpenAIWithRetry(client, payload, 1);

    return res.json({
      tool: "ai",
      status: "ok",
      mode: "openai",
      fallback: false,
      prompt,
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    const errorMsg = (error as Error).message;
    console.error("OPENAI ERROR — fallback to mock:", errorMsg);

    return res.json(mockResponse(prompt, errorMsg));
  }
}
