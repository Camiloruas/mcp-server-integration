export const pingWorkflow = {
  metadata: {
    id: "ping-workflow",
    name: "Ping Workflow",
    description: "Workflow com condition + transform + request",
    version: "1.3.0",
    status: "draft",
  },

  trigger: {
    type: "manual",
  },

  inputs: {
    message: {
      type: "string",
      required: false,
    },
  },

  steps: [
    {
      id: "check-message",
      type: "condition",
      expression: "hasMessage",
      onTrue: "transform-message",
      onFalse: "call-ping-api",
    },
    {
      id: "transform-message",
      type: "transform",
      action: "uppercaseMessage",
      next: "respond-with-message",
    },
    {
      id: "call-ping-api",
      type: "request",
      method: "GET",
      url: "https://mcp.camiloruas.dev/tools/ping",
      saveAs: "pingResult",
      next: "respond-from-api",
    },
    {
      id: "respond-from-api",
      type: "respond",
      payload: {
        message: "{{pingResult.result}}",
      },
    },
    {
      id: "respond-with-message",
      type: "respond",
      payload: {
        message: "{{message}}",
      },
    },
  ],

  outputs: {
    message: "string",
  },
};
