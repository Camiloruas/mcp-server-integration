export function authMiddleware(req, res, next) {
  const apiKeyHeader = req.headers["x-api-key"];

  if (!apiKeyHeader) {
    return res.status(401).json({
      error: "Missing API key",
    });
  }

  if (!process.env.MCP_API_KEYS) {
    console.error("MCP_API_KEYS not configured");
    return res.status(500).json({
      error: "Server authentication not configured",
    });
  }

  let apiKeys;

  try {
    apiKeys = JSON.parse(process.env.MCP_API_KEYS);
  } catch (err) {
    console.error("Invalid MCP_API_KEYS JSON", err);
    return res.status(500).json({
      error: "Server authentication misconfigured",
    });
  }

  const headerKey = apiKeyHeader.trim();

  const matchedKey = apiKeys.find(
    (k) => k.key.trim() === headerKey
  );

  if (!matchedKey) {
    return res.status(401).json({
      error: "Invalid API key",
    });
  }

  if (!matchedKey.active) {
    return res.status(403).json({
      error: "API key is disabled",
    });
  }

  // 🔎 Anexa informações da key à requisição
  req.apiKey = {
    name: matchedKey.name,
    key: matchedKey.key,
  };

  next();
}
