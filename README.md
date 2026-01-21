# MCP Server Integration

This repository presents the implementation of an **MCP Server (Model Context Protocol)** in Node.js with TypeScript, designed to act as a **central orchestration, governance, and security layer** between AI agents, internal tools, automations, and external services.

The project is not limited to a single platform, IDE, or tool. n8n is used as **one of the integrated tools**, serving as a practical proof of concept for creating and executing automations, but the architecture was designed to support **multiple tools**, agents, clients, and integrations over time.

---

## Project Objective

- Implement a centralized MCP Server
- Expose MCP tools via REST API
- Integrate AI agents with external tools
- Control permissions by API key and scope
- Orchestrate automations and various services
- Allow natural language interaction via external clients
- Serve as an extensible base for new tools
- Apply backend and DevOps best practices

---

## What is an MCP Server

The **Model Context Protocol (MCP)** defines a structured way for AI agents to use external tools in a controlled, auditable, and secure manner.

In this project, the MCP Server acts as:

- Intermediate layer between AI and tools
- Permission and scope controller
- Orchestrator of calls and flows
- Single point of integration and governance

The MCP Server is an always-on service, exposed via a public domain, responsible for executing real actions on behalf of authorized agents or clients.

---

## General Architecture

```
Client (CLI, IDE, CI/CD)
        |
        | (HTTPS + API Key + Scopes)
        v
     MCP Server
        |
        | (Specific credentials per tool)
        v
   External Tools
   (n8n, GitHub, Database, Future APIs)
```

The AI or client never directly accesses external tools. Every interaction passes through the MCP Server, which validates permissions, scopes, and execution rules.

---

## MCP Client and Portability

The project uses a simple **MCP Client**, based on the command line, responsible for sending natural language commands to the MCP Server.

MCP Client features:

- It is not a service
- It does not listen for connections
- It only executes HTTP calls to the MCP Server
- It can run in any environment with Node.js

The MCP Client can be used in:

- Cursor
- VS Code
- Neovim
- Pure Terminal
- Linux environments via SSH
- CI/CD Pipelines

The integration does not depend on any specific IDE. The IDE acts only as an editing environment and terminal.

---

## Project Structure

```
src/
├── middlewares/
├── services/
├── tools/
├── types/
├── index.ts
└── mcpServer.ts
```

---

## Execution

### Local Development

```bash
npm install
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Docker

```bash
docker compose up -d
```

---

## Security and Governance

Access to the MCP Server is controlled by multiple API keys with well-defined scopes, ensuring that each client or agent has only the necessary permissions.

---

## Extensibility

The architecture was designed to facilitate the addition of new tools, such as integrations with databases, GitHub, infrastructure services, and external APIs.

---

## Author

Camilo Ruas

GitHub: https://github.com/Camiloruas  
LinkedIn: https://www.linkedin.com/in/camilo-ruas-3a2a6425/  
Portfolio: https://www.camiloruas.dev/

---
---

# MCP Server Integration (Versão em Português)

Este repositório apresenta a implementação de um **MCP Server (Model Context Protocol)** em Node.js com TypeScript, projetado para atuar como uma **camada central de orquestração, governança e segurança** entre agentes de IA, ferramentas internas, automações e serviços externos.

O projeto não é limitado a uma única plataforma, IDE ou ferramenta. O n8n é utilizado como **uma das tools integradas**, servindo como prova prática de criação e execução de automações, mas a arquitetura foi pensada para suportar **múltiplas tools**, agentes, clientes e integrações ao longo do tempo.

---

## Objetivo do Projeto

- Implementar um MCP Server centralizado
- Expor ferramentas MCP via API REST
- Integrar agentes de IA com ferramentas externas
- Controlar permissões por API key e escopo
- Orquestrar automações e serviços diversos
- Permitir interação por linguagem natural via clientes externos
- Servir como base extensível para novas tools
- Aplicar boas práticas de backend e DevOps

---

## O que é um MCP Server

O **Model Context Protocol (MCP)** define uma forma estruturada para que agentes de IA utilizem ferramentas externas de maneira controlada, auditável e segura.

Neste projeto, o MCP Server atua como:

- Camada intermediária entre IA e ferramentas
- Controlador de permissões e escopos
- Orquestrador de chamadas e fluxos
- Ponto único de integração e governança

O MCP Server é um serviço sempre ativo, exposto via domínio público, responsável por executar ações reais em nome de agentes ou clientes autorizados.

---

## Arquitetura Geral

```
Cliente (CLI, IDE, CI/CD)
        |
        | (HTTPS + API Key + Scopes)
        v
     MCP Server
        |
        | (Credenciais específicas por tool)
        v
   Ferramentas externas
   (n8n, GitHub, Banco de Dados, APIs futuras)
```

A IA ou o cliente nunca acessa ferramentas externas diretamente. Toda interação passa pelo MCP Server, que valida permissões, escopos e regras de execução.

---

## MCP Client e Portabilidade

O projeto utiliza um **MCP Client** simples, baseado em linha de comando, responsável por enviar comandos em linguagem natural para o MCP Server.

Características do MCP Client:

- Não é um serviço
- Não fica escutando
- Apenas executa chamadas HTTP para o MCP Server
- Pode rodar em qualquer ambiente com Node.js

O MCP Client pode ser utilizado em:

- Cursor
- VS Code
- Neovim
- Terminal puro
- Ambientes Linux via SSH
- Pipelines CI/CD

A integração não depende de nenhuma IDE específica. A IDE atua apenas como ambiente de edição e terminal.

---

## Estrutura do Projeto

```
src/
├── middlewares/
├── services/
├── tools/
├── types/
├── index.ts
└── mcpServer.ts
```

---

## Execução

### Desenvolvimento Local

```bash
npm install
npm run dev
```

### Produção

```bash
npm run build
npm start
```

### Docker

```bash
docker compose up -d
```

---

## Segurança e Governança

O acesso ao MCP Server é controlado por múltiplas API keys com escopos bem definidos, garantindo que cada cliente ou agente tenha apenas as permissões necessárias.

---

## Extensibilidade

A arquitetura foi desenhada para facilitar a adição de novas tools, como integrações com bancos de dados, GitHub, serviços de infraestrutura e APIs externas.

---

## Autor

Camilo Ruas

GitHub: https://github.com/Camiloruas  
LinkedIn: https://www.linkedin.com/in/camilo-ruas-3a2a6425/  
Portfólio: https://www.camiloruas.dev/
