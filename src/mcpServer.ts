import express, { Express, Request, Response } from "express";
import { authMiddleware } from "./middlewares/auth.js";
import { rateLimitMiddleware } from "./middlewares/rateLimit.js";

import { pingTool } from "./tools/system/ping.js";
import { callN8nWebhook } from "./tools/n8n/callN8nWebhook.js";
import { aiTool } from "./tools/ai/ai.js";
import { aiInfoTool } from "./tools/ai/aiInfo.js";
import { evolutionWebhookTool } from "./tools/evolution/evolutionWebhook.js";
import { workflowRunN8nTool } from "./tools/n8n/workflowRunN8n.js";
import { workflowGenerateTool } from "./tools/n8n/workflowGenerate.js";
import { agentWorkflowFromText } from "./agents/agentWorkflowFromText.js";
import { createGitHubIssueTool } from "./tools/github/createIssue.js";
export function createMcpServer(): Express {
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json());

  // Health check
  app.get("/", (req: Request, res: Response) => {
    res.json({
      service: "MCP Server",
      status: "ok",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    });
  });

  //  Rotas abertas
  app.get("/tools/ping", pingTool);

  //  Rate limit aplicado a TODAS as rotas protegidas
  app.use(rateLimitMiddleware);

  //  Rotas protegidas COM SCOPES

  // Executar workflow (n8n, admin)
  app.post("/tools/workflow/run", authMiddleware("workflow:run"), workflowRunN8nTool);

  // Gerar workflow (ChatGPT, admin)
  app.post("/tools/workflow/generate", authMiddleware("workflow:generate"), workflowGenerateTool);

  // AI
  app.post("/tools/ai", authMiddleware("ai:use"), aiTool);

  app.get("/tools/ai/info", authMiddleware("ai:use"), aiInfoTool);

  // Webhook sensível (somente admin)
  app.post("/webhook/evolution", authMiddleware("admin:*"), evolutionWebhookTool);

  // (opcional) endpoint genérico n8n
  app.post("/tools/n8n", authMiddleware("workflow:run"), callN8nWebhook);

  app.post("/agent/workflow/from-text", authMiddleware("workflow:generate"), agentWorkflowFromText);

  app.post(
    "/tools/github/issue/create",
    authMiddleware("github:issue:create"),
    rateLimitMiddleware,
    async (req, res) => {
      const result = await createGitHubIssueTool(req.body)
      res.json(result)
    }
  )

  return app;
}
