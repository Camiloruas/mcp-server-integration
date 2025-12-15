import { createMcpServer } from "./mcpServer.js";

const PORT = process.env.PORT || 3333;

// Cria o app MCP (todas as rotas estão no mcpServer.js)
const app = createMcpServer();

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});
