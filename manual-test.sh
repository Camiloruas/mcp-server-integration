#!/bin/bash

# Configuration
# Change this URL if testing on the live server, e.g., https://mcp.camiloruas.dev
SERVER_URL="http://localhost:3333"

echo "Testing Workflow Generation on $SERVER_URL..."

# Payload mimicking a request to create a simple workflow
# The structure wraps the data in "input" as expected by the endpoint
PAYLOAD='{
  "input": {
    "name": "Test Webhook Workflow via Curl",
    "nodes": [
      {
        "parameters": {
          "path": "test-curl-webhook",
          "responseMode": "lastNode",
          "options": {}
        },
        "name": "Webhook",
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 1,
        "position": [0, 0],
        "id": "2d1f7e9a-5b3c-4d2e-8f1a-9b7c6d4e3f8a"
      },
      {
        "parameters": {
          "content": "Hello from MCP Server Test!",
          "height": 100,
          "width": 300
        },
        "name": "Sticky Note",
        "type": "n8n-nodes-base.stickyNote",
        "typeVersion": 1,
        "position": [200, 0],
        "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6"
      }
    ],
    "connections": {}
  }
}'

curl -X POST "$SERVER_URL/tools/workflow/generate" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"

echo -e "\n\nTest completed."
