export async function workflowGenerateTool(req, res) {
  try {
    const { input } = req.body || {};
    const { name, nodes, connections, settings } = input || {};

    if (!nodes || !connections) {
      return res.status(400).json({
        tool: "workflow-generate",
        status: "error",
        message: "nodes and connections are required",
      });
    }

    // ❌ NÃO pode enviar `active` aqui
    const workflow = {
      name: name || `workflow-generated-${Date.now()}`,
      nodes,
      connections,
      settings: settings || {},
    };

    console.log(`[workflowGenerate] Creating workflow: ${workflow.name}`);

    // 1️⃣ Cria o workflow
    const response = await fetch(`${process.env.N8N_BASE_URL}/api/v1/workflows`, {
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

    // 2️⃣ ATIVA o workflow (chamada separada — isso é permitido)
    try {
      await fetch(`${process.env.N8N_BASE_URL}/api/v1/workflows/${data.id}/activate`, {
        method: "POST",
        headers: {
          "X-N8N-API-KEY": process.env.N8N_API_KEY,
        },
      });
    } catch (activateErr) {
      console.warn(`[workflowGenerate] Workflow created but not activated: ${activateErr.message}`);
    }

    // 3️⃣ Monta webhook URL (sua lógica preservada)
    let webhookUrl = null;
    const webhookNode = nodes.find((n) => n.type?.includes("webhook"));

    if (webhookNode) {
      const path = webhookNode.parameters?.path || "";
      if (path) {
        webhookUrl = `${process.env.N8N_WEBHOOK_URL}/${path}`;
      }
    }

    res.json({
      tool: "workflow-generate",
      status: "ok",
      workflowId: data.id,
      name: data.name,
      webhookUrl: webhookUrl || "Check n8n UI for details",
      active: true,
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
