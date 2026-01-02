import { Request, Response } from "express";

export function aiInfoTool(req: Request, res: Response) {
  const isOpenAI = process.env.AI_MODE === "openai";

  res.json({
    tool: "ai",
    mode: isOpenAI ? "openai" : "mock",
    model: isOpenAI ? process.env.OPENAI_MODEL || null : null,
    openaiEnabled: isOpenAI,
    timestamp: new Date().toISOString(),
  });
}
