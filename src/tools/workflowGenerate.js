import axios from "axios";

export async function workflowGenerate() {
  const workflow = {
    name: "auto-ping-from-chatgpt",
    active: true,
    nodes: [
      {
        id: "webhook-node",
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
        id: "respond-node",
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
        main: [[{ node: "Respond to Webhook", type: "main", index: 0 }]],
      },
    },
  };

  const res = await axios.post("http://n8n:5678/api/v1/workflows", workflow, {
    headers: {
      "X-N8N-API-KEY": process.env.N8N_API_KEY,
    },
  });

  return {
    status: "ok",
    workflowId: res.data.id,
    webhook: "https://webhook.camiloruas.dev/webhook/auto-ping",
  };
}
