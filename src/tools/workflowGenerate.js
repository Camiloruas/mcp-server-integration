export async function workflowGenerateTool(req, res) {
  try {
    const { input } = req.body || {};
    // Agora aceita estrutura dinâmica do ChatGPT
    const { name, nodes, connections, settings } = input || {};

    if (!nodes || !connections) {
      return res.status(400).json({
        tool: "workflow-generate",
        status: "error",
        message: "nodes and connections are required",
      });
    }

    const workflow = {
      name: name || `workflow-generated-${Date.now()}`,
      nodes: nodes,
      connections: connections,
      settings: settings || {},
      active: true, // Já cria ativado por padrão
    };

    console.log(`[workflowGenerate] Creating workflow: ${workflow.name}`);

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

    // Tenta encontrar o Webhook URL se houver um node de webhook
    let webhookUrl = null;
    const webhookNode = nodes.find(n => n.type.includes("webhook"));

    if (webhookNode) {
      // Construção básica da URL, dependendo de como o n8n está exposto
      // Aqui assumimos o padrão de produção ou tunel
      const path = webhookNode.parameters?.path || "";
      const method = webhookNode.parameters?.httpMethod || "GET";
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
