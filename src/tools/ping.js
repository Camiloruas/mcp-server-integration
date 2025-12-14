export function pingTool(req, res) {
  res.json({
    tool: "ping",
    result: "pong",
    timestamp: new Date().toISOString()
  });
}
