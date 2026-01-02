import { Request, Response } from "express";

export function pingTool(req: Request, res: Response) {
  res.json({
    tool: "ping",
    result: "pong",
    timestamp: new Date().toISOString()
  });
}
