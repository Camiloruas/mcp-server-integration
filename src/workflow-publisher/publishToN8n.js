import fetch from "node-fetch";

export async function publishToN8n(workflowJson) {
  const baseUrl = process.env.N8N_BASE_URL;
  const apiKey = process.env.N8N_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("N8N_BASE_URL or N8N_API_KEY not configured");
  }

  const headers = {
    "Content-Type": "application/json",
    "X-N8N-API-KEY": apiKey,
  };

  /* 1️⃣ LISTAR WORKFLOWS */
  const listRes = await fetch(`${baseUrl}/api/v1/workflows`, { headers });
  const list = await listRes.json();

  let workflow = list.data.find((w) => w.name === workflowJson.name);

  /* 2️⃣ CRIAR SE NÃO EXISTIR */
  if (!workflow) {
    const createRes = await fetch(`${baseUrl}/api/v1/workflows`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: workflowJson.name,
        nodes: workflowJson.nodes,
        connections: workflowJson.connections,
        settings: workflowJson.settings || {},
      }),
    });

    if (!createRes.ok) {
      throw new Error(`Create failed: ${await createRes.text()}`);
    }

    workflow = await createRes.json();
  }

  /* 3️⃣ ATIVAR */
  if (!workflow.active) {
    const activateRes = await fetch(`${baseUrl}/api/v1/workflows/${workflow.id}/activate`, {
      method: "POST",
      headers,
    });

    if (!activateRes.ok) {
      throw new Error(`Activate failed: ${await activateRes.text()}`);
    }
  }

  return {
    id: workflow.id,
    name: workflow.name,
    active: true,
  };
}
