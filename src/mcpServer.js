import express from "express";
import { pingTool } from "./tools/ping.js";
import { callN8nWebhook } from "./tools/callN8nWebhook.js";
import { aiTool } from "./tools/ai.js";
import { aiInfoTool } from "./tools/aiInfo.js";
import { evolutionWebhookTool } from "./tools/evolutionWebhook.js";
import { workflowRunTool } from "./tools/workflowRun.js";
import { workflowTranslateTool } from "./tools/workflowTranslate.js";
import { workflowPublishTool } from "./tools/workflowPublish.js";
import { translateTool } from "./tools/translate.js";
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

  app.get("/tools/ping", pingTool);
  app.post("/tools/n8n", callN8nWebhook);
  app.post("/tools/ai", aiTool);
  app.get("/tools/ai/info", aiInfoTool);
  app.post("/webhook/evolution", evolutionWebhookTool);
  app.post("/tools/workflow/run", workflowRunTool);
  app.get("/tools/workflow/translate", workflowTranslateTool);
  app.post("/tools/workflow/publish", workflowPublishTool);
  app.post("/tools/translate", translateTool);
  app.post("/tools/workflow/generate", workflowGenerateTool);


  return app;
}
