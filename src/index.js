import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Importando para fazer as requisições HTTP

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

// Rota de status
app.get("/", (req, res) => {
  res.json({
    service: "MCP Server",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Rota de ferramentas
app.get("/mcp/tools", (req, res) => {
  res.json({
    server: "mcp-server",
    version: "1.0.0",
    tools: [
      {
        name: "ping",
        description: "Health check tool",
        method: "POST",
        path: "/tools/ping",
      },
      {
        name: "n8n-webhook",
        description: "Send data to n8n webhook",
        method: "POST",
        path: "/tools/n8n-webhook",
      },
    ],
    timestamp: new Date().toISOString(),
  });
});

// Rota de ping
app.get("/tools/ping", (req, res) => {
  res.json({
    tool: "ping",
    response: "pong",
    timestamp: new Date().toISOString(),
  });
});

// Rota para chamar o webhook do n8n
app.post("/tools/n8n-webhook", async (req, res) => {
  try {
    const response = await fetch("https://n8n.camiloruas.dev/webhook/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body), // Passa o corpo da requisição para o n8n
    });

    const data = await response.json();

    // Retorna a resposta do n8n
    res.json({
      tool: "n8n-webhook",
      status: "success",
      data: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      tool: "n8n-webhook",
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});
