import { publishToN8n } from "../workflow-publisher/publishToN8n.js";
import { translateWorkflowToN8n } from "../workflow-translator/toN8n.js";
import { pingWorkflow } from "../workflows/ping.workflow.js";

export async function workflowPublishTool(req, res) {
  try {
    const n8nWorkflow = translateWorkflowToN8n(pingWorkflow);
    const result = await publishToN8n(n8nWorkflow);

    res.json({
      tool: "workflow-publish",
      status: "ok",
      n8nWorkflowId: result.id,
      name: result.name
    });
  } catch (err) {
    console.error("Workflow publish error:", err);
    res.status(500).json({
      tool: "workflow-publish",
      status: "error",
      message: err.message
    });
  }
}
