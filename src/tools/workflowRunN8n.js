import axios from "axios";

export async function workflowRunN8nTool(req, res) {
  try {
    const { input } = req.body || {};
    const { workflowId, data } = input || {};

    if (!workflowId) {
      return res.status(400).json({
        tool: "workflow-run",
        status: "error",
        message: "workflowId is required",
      });
    }

    const n8nBaseUrl = process.env.N8N_BASE_URL;
    const apiKey = process.env.N8N_API_KEY;

    if (!n8nBaseUrl || !apiKey) {
      return res.status(500).json({
        tool: "workflow-run",
        status: "error",
        message: "N8N_BASE_URL or N8N_API_KEY not configured",
      });
    }

    const response = await axios.post(`${n8nBaseUrl}/api/v1/workflows/${workflowId}/run`, data || {}, {
      headers: {
        "Content-Type": "application/json",
        "X-N8N-API-KEY": apiKey,
      },
    });

    return res.json({
      tool: "workflow-run",
      status: "ok",
      workflowId,
      executionId: response.data?.id || null,
    });
  } catch (error) {
    return res.status(500).json({
      tool: "workflow-run",
      status: "error",
      message: error.response?.data || error.message,
    });
  }
}
