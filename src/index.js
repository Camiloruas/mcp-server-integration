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
      {
        name: "ai",
        description: "OpenAI text generation",
        method: "POST",
        path: "/tools/ai",
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

    // --- INÍCIO DA ALTERAÇÃO (CÓDIGO RESILIENTE ANTI-502) ---

    // 1. Lê a resposta do n8n como texto (mais seguro contra timeouts e JSON inválido)
    const responseText = await response.text();
    let result;

    try {
      // 2. Tenta parsear o texto em JSON
      result = JSON.parse(responseText);
    } catch (parseError) {
      // 3. Se falhar, encapsula o erro e a resposta bruta para debug
      console.error("JSON Parsing Error from n8n:", parseError.message);
      result = {
        error: "Failed to parse n8n response as JSON",
        rawResponse: responseText,
        status: response.status,
        statusText: response.statusText,
      };
    }

    // 4. Devolve o resultado encapsulado (JSON parseado OU o objeto de erro)
    res.json({
      tool: "n8n",
      status: "ok",
      action,
      n8nResponse: result,
    });

    // --- FIM DA ALTERAÇÃO ---
  } catch (error) {
    // Este catch lida com falhas de rede (ex: n8n completamente offline)
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
