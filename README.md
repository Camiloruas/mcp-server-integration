# MCP Server Integration — GPT → MCP → n8n

Este repositório demonstra a implementação de um **MCP Server (Model Context Protocol)** em Node.js, atuando como **camada de governança e orquestração** entre **IA (OpenAI / GPT)**, **n8n** e APIs externas, com foco em **segurança, controle de permissões e automação real**.

O projeto simula um **ambiente de produção**, utilizando Docker, múltiplas API keys com scopes, rate limit e criação automática de workflows no n8n a partir de comandos em linguagem natural.

---

##  Objetivo do Projeto

- Implementar um MCP Server centralizado
- Expor ferramentas MCP via REST
- Integrar IA (OpenAI), n8n e APIs externas
- Criar workflows no n8n automaticamente
- Demonstrar governança de IA com segurança
- Aplicar boas práticas de backend e DevOps

---

##  O que é um MCP Server

O **Model Context Protocol (MCP)** permite que agentes de IA utilizem ferramentas externas de forma organizada, segura e auditável.

Neste projeto, o MCP Server atua como:
- Camada intermediária entre IA e sistemas externos
- Controlador de permissões (API Keys + Scopes)
- Orquestrador de automações
- Ponto único de observabilidade e segurança

---

##  Arquitetura Geral

```
Usuário / Agente GPT
        |
        | (x-api-key + scopes)
        v
     MCP Server
        |
        | (N8N_API_KEY)
        v
        n8n
```

---

##  Estrutura do Projeto

```
src/
├── middlewares/
│   ├── auth.js
│   └── rateLimit.js
├── tools/
│   ├── ai.js
│   ├── aiInfo.js
│   ├── workflowRunN8n.js
│   ├── workflowGenerate.js
│   └── agentWorkflowFromText.js
├── mcpServer.js
└── index.js
```

---

##  Execução com Docker

```bash
docker compose up -d
```

---

##  Segurança e Governança

### Múltiplas API Keys com Scopes

Exemplo:
```json
[
  { "name": "camilo-admin", "scopes": ["*"] },
  { "name": "n8n", "scopes": ["workflow:run"] },
  { "name": "chatgpt-agent", "scopes": ["ai:use", "workflow:generate"] }
]
```

### Scopes por Rota

| Rota | Scope |
|----|----|
| /tools/workflow/run | workflow:run |
| /tools/workflow/generate | workflow:generate |
| /tools/ai | ai:use |
| /agent/workflow/from-text | workflow:generate |
| /webhook/evolution | admin:* |

---

##  Agente: Criar Workflow a partir de Texto

```
POST /agent/workflow/from-text
```

Exemplo:
```json
{
  "text": "Crie um workflow no n8n com webhook POST /lead"
}
```

Fluxo:
```
Texto → GPT → JSON → MCP → n8n
```

---

##  Domínios

- mcp.camiloruas.dev
- n8n.camiloruas.dev
- webhook.camiloruas.dev

---

##  Autor

**Camilo Ruas**

GitHub: https://github.com/Camiloruas  
LinkedIn: https://www.linkedin.com/in/camilo-ruas-3a2a6425/
