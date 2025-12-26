export function authMiddleware(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      error: "Missing API key",
    });
  }

  if (apiKey !== process.env.MCP_API_KEY) {
    return res.status(401).json({
      error: "Invalid API key",
    });
  }

  next();
}
