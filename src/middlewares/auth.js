export function authMiddleware(req, res, next) {
  // Header vindo do cliente
  const apiKeyHeader = req.headers["x-api-key"];

  // Chave definida no ambiente
  const apiKeyEnv = process.env.MCP_API_KEY;

  // Se não veio header
  if (!apiKeyHeader) {
    return res.status(401).json({
      error: "Missing API key",
    });
  }

  // Se não existe no ambiente (configuração errada)
  if (!apiKeyEnv) {
    console.error("MCP_API_KEY is not defined in environment variables");
    return res.status(500).json({
      error: "Server authentication not configured",
    });
  }

  // Normalização (AQUI ESTÁ A CORREÇÃO DEFINITIVA)
  const headerKey = apiKeyHeader.trim();
  const envKey = apiKeyEnv.trim();

  // Comparação segura
  if (headerKey !== envKey) {
    return res.status(401).json({
      error: "Invalid API key",
    });
  }

  // Tudo certo
  next();
}
