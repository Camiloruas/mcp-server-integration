export const pingWorkflow = {
  metadata: {
    id: "ping-workflow",
    name: "Ping Workflow",
    description: "Workflow com condition + transform",
    version: "1.2.0",
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
      onFalse: "respond-pong",
    },
    {
      id: "transform-message",
      type: "transform",
      action: "uppercaseMessage",
      next: "respond-with-message",
    },
    {
      id: "respond-with-message",
      type: "respond",
      payload: {
        message: "{{message}}",
      },
    },
    {
      id: "respond-pong",
      type: "respond",
      payload: {
        message: "pong",
      },
    },
  ],

  outputs: {
    message: "string",
  },
};
