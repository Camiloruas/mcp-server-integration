

export async function evolutionWebhookTool(req, res) {
  console.log("EVOLUTION WEBHOOK RECEIVED");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const event = req.body;

    if (!event || !event.event) {
      console.warn("⚠️ Invalid Evolution payload");
      return res.status(400).json({ ok: false });
    }

    const payload = {
      source: "evolution",
      event: event.event,
      instance: event.instance || null,
      data: event.data || event,
    };

    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "mcp-server",
          action: "evolution-event",
          data: payload,
          timestamp: new Date().toISOString()
        })
      }).catch((err) => {
        console.error(" Error forwarding to n8n:", err.message);
      });
    } else {
      console.warn("⚠️ N8N_WEBHOOK_URL not configured, skipping forward to n8n");
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(" Evolution webhook error:", err);
    return res.status(200).json({ ok: true });
  }
}
