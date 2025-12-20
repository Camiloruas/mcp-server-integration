import { pingWorkflow } from "../workflows/ping.workflow.js";
import { executeWorkflow } from "../workflow-engine/executeWorkflow.js";

export async function workflowRunTool(req, res) {
  try {
    const output = await executeWorkflow(pingWorkflow, {
      input: req.body || {}
    });

    return res.json({
      tool: "workflow",
      status: "ok",
      output
    });
  } catch (err) {
    return res.status(500).json({
      tool: "workflow",
      status: "error",
      message: err.message
    });
  }
}
