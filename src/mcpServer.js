// MCP Server implementation placeholder
import { ping } from "./tools/ping.js";

export async function handleToolCall(toolName, args = {}) {
  switch (toolName) {
    case "ping":
      return await ping();

    default:
      throw new Error(`Tool "${toolName}" not found`);
  }
}
