// Entry point placeholder
import { handleToolCall } from "./mcpServer.js";

async function main() {
  const result = await handleToolCall("ping");
  console.log(result);
}

main();
