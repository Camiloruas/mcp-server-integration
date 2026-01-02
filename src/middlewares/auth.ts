import { Request, Response, NextFunction } from "express";

export interface ApiKeyConfig {
  name: string;
  key: string;
  active: boolean;
  scopes?: string[];
}

export interface AuthenticatedRequest extends Request {
  apiKey?: {
    name: string;
    scopes: string[];
  };
}

function hasScope(scopes: string[] = [], required: string): boolean {
  if (scopes.includes("*") || scopes.includes("admin:*")) return true;
  return scopes.includes(required);
}

export function authMiddleware(requiredScope: string | null = null) {
  return function (req: Request, res: Response, next: NextFunction) {
    const apiKeyHeader = req.headers["x-api-key"] as string | undefined;

    if (!apiKeyHeader) {
      return res.status(401).json({ error: "Missing API key" });
    }

    if (!process.env.MCP_API_KEYS) {
      console.error("MCP_API_KEYS not configured");
      return res.status(500).json({ error: "Server auth not configured" });
    }

    let apiKeys: ApiKeyConfig[];
    try {
      apiKeys = JSON.parse(process.env.MCP_API_KEYS);
    } catch (err) {
      console.error("Invalid MCP_API_KEYS JSON", err);
      return res.status(500).json({ error: "Server auth misconfigured" });
    }

    const headerKey = apiKeyHeader.trim();

    const matchedKey = apiKeys.find((k) => k.key.trim() === headerKey);

    if (!matchedKey) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    if (!matchedKey.active) {
      return res.status(403).json({ error: "API key disabled" });
    }

    if (requiredScope && !hasScope(matchedKey.scopes || [], requiredScope)) {
      return res.status(403).json({
        error: "Insufficient scope",
        required: requiredScope,
      });
    }

    // Anexa info da key à request (útil para logs)
    (req as AuthenticatedRequest).apiKey = {
      name: matchedKey.name,
      scopes: matchedKey.scopes || [],
    };

    next();
  };
}
