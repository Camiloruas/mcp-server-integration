import fetch from "node-fetch";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function callN8nWebhook(req, res) {
  try {
    if (!N8N_WEBHOOK_URL) {
      return res.status(500).json({
        error: "N8N_WEBHOOK_URL not configured"
      });
    }

    const payload = {
      from: "mcp-server",
      action: req.body?.action || "unknown",
      data: req.body?.data || {}
    };

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    res.json({
      tool: "n8n",
      status: "ok",
      n8nResponse: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      tool: "n8n",
      status: "error",
      message: error.message
    });
  }
}
