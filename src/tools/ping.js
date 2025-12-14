// Ping tool implementation placeholder
export async function ping() {
  return {
    status: "ok",
    message: "MCP Server is alive ",
    timestamp: new Date().toISOString(),
  };
}
