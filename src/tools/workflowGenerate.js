export async function workflowGenerateTool(req, res) {
  try {
    const workflow = {
      name: "auto-ping-from-chatgpt",
      settings: {},
      nodes: [
        {
          id: "Webhook",
          name: "Webhook",
          type: "n8n-nodes-base.webhook",
          typeVersion: 2,
          position: [0, 0],
          parameters: {
            httpMethod: "POST",
            path: "auto-ping",
            responseMode: "responseNode",
          },
        },
        {
          id: "Respond to Webhook",
          name: "Respond to Webhook",
          type: "n8n-nodes-base.respondToWebhook",
          typeVersion: 1,
          position: [240, 0],
          parameters: {
            respondWith: "json",
            responseBody: JSON.stringify({ result: "pong" }),
          },
        },
      ],
      connections: {
        Webhook: {
          main: [
            [
              {
                node: "Respond to Webhook",
                type: "main",
                index: 0,
              },
            ],
          ],
        },
      },
    };

    const response = await fetch("http://n8n:5678/api/v1/workflows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-N8N-API-KEY": process.env.N8N_API_KEY,
      },
      body: JSON.stringify(workflow),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`n8n error: ${text}`);
    }

    const data = await response.json();

    res.json({
      tool: "workflow-generate",
      status: "ok",
      workflowId: data.id,
      webhookUrl: "https://webhook.camiloruas.dev/webhook/auto-ping",
    });
  } catch (err) {
    console.error("workflowGenerate error:", err);

    res.status(500).json({
      tool: "workflow-generate",
      status: "error",
      message: err.message,
    });
  }
}
