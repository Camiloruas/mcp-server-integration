import { pingWorkflow } from "../workflows/ping.workflow.js";
import { translateWorkflowToN8n } from "../workflow-translator/toN8n.js";

export function workflowTranslateTool(req, res) {
  try {
    const n8nJson = translateWorkflowToN8n(pingWorkflow);

    return res.json({
      tool: "workflow-translate",
      status: "ok",
      workflow: n8nJson,
    });
  } catch (err) {
    return res.status(500).json({
      tool: "workflow-translate",
      status: "error",
      message: err.message,
    });
  }
}
