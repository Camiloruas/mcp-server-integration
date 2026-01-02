# MCP Server Integration

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
