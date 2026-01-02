import { Request, Response } from "express";
import fetch from "node-fetch";

export async function workflowRunN8nTool(req: Request, res: Response) {
  try {
    const { input } = req.body || {};
    const { webhookUrl, data } = input || {};

    if (!webhookUrl) {
      return res.status(400).json({
        tool: "workflow-run",
        status: "error",
        message: "webhookUrl is required",
      });
    }

    // Executa via Webhook conforme decisão arquitetural
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data || {}),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`n8n webhook error ${response.status}: ${text}`);
    }

    const responseData = await response.json().catch(() => ({ status: "ok" }));

    return res.json({
      tool: "workflow-run",
      status: "ok",
      webhookUrl,
      result: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      tool: "workflow-run",
      status: "error",
      message: (error as Error).message,
    });
  }
}
