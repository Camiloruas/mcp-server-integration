export const pingWorkflow = {
  metadata: {
    id: "ping-workflow",
    name: "Ping Workflow",
    description: "Workflow com condition",
    version: "1.1.0",
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
      onTrue: "respond-with-message",
      onFalse: "respond-pong",
    },
    {
      id: "respond-with-message",
      type: "respond",
      payload: {
        message: "mensagem recebida",
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
