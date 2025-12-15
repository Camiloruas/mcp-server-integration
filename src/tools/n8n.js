export async function n8nTool({ action, data }) {
  if (!action) {
    throw new Error("Missing 'action' field");
  }

  const response = await fetch(process.env.N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "mcp-server",
      action,
      data: data || {},
      timestamp: new Date().toISOString()
    })
  });

  const responseText = await response.text();

  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    result = {
      rawResponse: responseText,
      status: response.status,
      statusText: response.statusText
    };
  }

  return {
    ok: response.ok,
    status: response.status,
    data: result
  };
}
