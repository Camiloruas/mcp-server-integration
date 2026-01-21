export interface McpToolRequest<T = unknown> {
    input: T;
}

export interface McpToolResponse {
    tool: string;
    status: "ok" | "error";
    message?: string;
    [key: string]: any; // Allows extra fields like 'result', 'workflowId', etc.
}

export interface Node {
    parameters: Record<string, any>;
    [key: string]: any;
}

export interface WorkflowInput {
    name?: string;
    nodes: Node[];
    connections: Record<string, any>;
    settings?: Record<string, any>;
}
