export const pingWorkflow = {
  metadata: {
    id: "ping-workflow",
    name: "Ping Workflow",
    description: "Workflow de teste para validar o motor",
    version: "1.0.0",
    status: "draft",
  },

  trigger: {
    type: "manual",
  },

  inputs: {},

  steps: [
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
