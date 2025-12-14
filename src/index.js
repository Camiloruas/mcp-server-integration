import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3333;

// URL de PRODUÇÃO do n8n
const N8N_WEBHOOK_URL = "https://webhook.camiloruas.dev/webhook/mcp";

app.use(cors());
app.use(express.json());

/* Health */
app.get("/", (req, res) => {
  res.json({
    service: "MCP Server",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

/* Lista de tools MCP */
app.get("/mcp/tools", (req, res) => {
  res.json({
    server: "mcp-server",
    version: "1.0.0",
    tools: [
      {
        name: "ping",
        method: "POST",
        path: "/tools/ping",
      },
      {
        name: "n8n",
        description: "Send actions to n8n workflows",
        method: "POST",
        path: "/tools/n8n",
      },
    ],
  });
});

/* TOOL → n8n */
app.post("/tools/n8n", async (req, res) => {
  const { action, data } = req.body;

  if (!action) {
    return res.status(400).json({
      error: "Missing 'action' field",
    });
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "mcp-server",
        action,
        data: data || {},
        timestamp: new Date().toISOString(),
      }),
    });

    const result = await response.json();

    res.json({
      tool: "n8n",
      status: "ok",
      action,
      n8nResponse: result,
    });
  } catch (error) {
    res.status(500).json({
      tool: "n8n",
      status: "error",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});
