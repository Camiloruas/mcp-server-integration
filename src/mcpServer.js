import express from "express";
import { authMiddleware } from "./middlewares/auth.js";
import { rateLimitMiddleware } from "./middlewares/rateLimit.js";
import { pingTool } from "./tools/ping.js";
import { callN8nWebhook } from "./tools/callN8nWebhook.js";
import { aiTool } from "./tools/ai.js";
import { aiInfoTool } from "./tools/aiInfo.js";
import { evolutionWebhookTool } from "./tools/evolutionWebhook.js";
import { workflowRunN8nTool } from "./tools/workflowRunN8n.js";
import { workflowGenerateTool } from "./tools/workflowGenerate.js";

export function createMcpServer() {
  const app = express();

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      service: "MCP Server",
      status: "ok",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });
  // Rotas abertas
  app.get("/tools/ping", pingTool);

  // Rotas seguras -  Middleware aplicado A PARTIR DAQUI
  app.use(authMiddleware);
  app.use(rateLimitMiddleware);

  app.post("/tools/n8n", callN8nWebhook);
  app.post("/tools/ai", aiTool);
  app.get("/tools/ai/info", aiInfoTool);
  app.post("/webhook/evolution", evolutionWebhookTool);
  app.post("/tools/workflow/run", workflowRunN8nTool);
  app.post("/tools/workflow/generate", workflowGenerateTool);

  return app;
}
