import { createMcpServer } from "./mcpServer.js";

const PORT = process.env.PORT || 3333;

const app = createMcpServer();

app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});
