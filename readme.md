# MCP Server Integration

Este repositório demonstra a integração de um MCP Server (Model Context Protocol) com OpenAI, n8n e outros serviços, rodando em ambiente Docker, com foco em aprendizado prático, arquitetura real e boas práticas de backend.

O projeto foi desenvolvido como um ambiente real de estudos, simulando cenários de produção com uso de containers, variáveis de ambiente, fallback de IA, timeout, retry e observabilidade básica.

## Objetivo do Projeto

- Implementar um MCP Server centralizado em Node.js
- Expor ferramentas MCP via REST
- Integrar o MCP com OpenAI e n8n
- Demonstrar uso de Docker e Docker Compose
- Aplicar boas práticas de organização, resiliência e documentação

## O que é um MCP Server

O Model Context Protocol permite que agentes de IA utilizem ferramentas externas de forma organizada, reutilizável e desacoplada.

O MCP Server atua como uma camada intermediária responsável por centralizar integrações, padronizar respostas e aplicar regras de fallback, timeout e segurança.

## Arquitetura Geral

Cliente ou IA consome o MCP Server, que por sua vez se comunica com OpenAI, n8n e APIs externas.

## Estrutura do Projeto

mcp-server/
├── docker/
│   └── Dockerfile
├── docker-compose.yml
├── docs/
│   └── images/
├── src/
│   ├── index.js
│   ├── mcpServer.js
│   └── tools/
│       ├── ai.js
│       ├── aiInfo.js
│       ├── ping.js
│       ├── callN8nWebhook.js
│       ├── workflowGenerate.js
│       └── n8n.js
├── .env.example
├── README.md

## Execução com Docker

Pré-requisitos:
- Docker
- Docker Compose

Para subir o ambiente:

docker compose up -d

Para acompanhar os logs:

docker compose logs -f mcp-server

## Ferramentas Disponíveis

### Health Check

GET /

Retorna o status do MCP Server.

### Ping

GET /tools/ping

Teste simples de conectividade.

### Integração com n8n

POST /tools/n8n

Permite disparar webhooks do n8n a partir do MCP Server.

### Geração Automática de Workflow no n8n

POST /tools/workflow/generate

Cria workflows automaticamente no n8n.

Funcionalidades:
- Criação dinâmica de workflow
- Definição automática de webhook
- Publicação direta no n8n
- Retorno da URL do webhook

Exemplo de resposta:

{
  "tool": "workflow-generate",
  "status": "ok",
  "workflowId": "jb6tL0eKiPLgehPR",
  "webhookUrl": "https://webhook.camiloruas.dev/webhook/auto-ping"
}

Essa funcionalidade permite que agentes de IA criem automações reais no n8n sob demanda.

### Tool de IA

POST /tools/ai

- Integração com OpenAI
- Fallback automático
- Timeout e retry configurados

### Diagnóstico da IA

GET /tools/ai/info

Retorna informações de diagnóstico sem consumir tokens.

## Containers em Execução

O projeto roda em servidor self-hosted com gerenciamento via Portainer.

Imagem ilustrativa:

Inserir imagem em docs/images/portainer.png

## Domínios Utilizados

- mcp.camiloruas.dev
- n8n.camiloruas.dev
- webhook.camiloruas.dev
- portainer.camiloruas.dev

A exposição externa é feita via Cloudflare Tunnel.

## Boas Práticas Aplicadas

- Variáveis sensíveis fora do versionamento
- Arquivo .env.example para referência
- Containers isolados
- Fallback de IA
- Organização por responsabilidade

## Próximas Etapas

- Criação de tool para execução de workflows
- Integração MCP com ChatGPT via conversation
- Geração de workflows a partir de linguagem natural
- Autenticação de endpoints
- Observabilidade e logs estruturados

## Autor

Camilo Ruas

GitHub:
https://github.com/Camiloruas

LinkedIn:
https://www.linkedin.com/in/camilo-ruas-3a2a6425/

Projeto em constante evolução.

