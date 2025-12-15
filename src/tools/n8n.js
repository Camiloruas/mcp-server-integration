export async function n8nTool(req, res) {
  try {
    const { action, data } = req.body;

    if (!action) {
      return res.status(400).json({
        error: "Missing 'action' field"
      });
    }

    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "mcp-server",
        action,
        data,
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();

    return res.json(result);
  } catch (error) {
    console.error("N8N TOOL ERROR:", error);

    return res.status(502).json({
      error: "Failed to call n8n",
      details: error.message
    });
  }
}
