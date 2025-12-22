import fetch from "node-fetch";

export async function publishToN8n(workflowJson) {
  const baseUrl = process.env.N8N_BASE_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("N8N_BASE_URL or N8N_API_KEY not configured");
  }

  const response = await fetch(`${baseUrl}/rest/workflows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": apiKey,
    },
    body: JSON.stringify({
      name: workflowJson.name,
      nodes: workflowJson.nodes,
      connections: workflowJson.connections,
      active: false,
      settings: workflowJson.settings || {},
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`n8n error ${response.status}: ${text}`);
  }

  return response.json();
}
