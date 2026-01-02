# MCP Server Integration

Este repositório apresenta a implementação de um **MCP Server (Model Context Protocol)** em Node.js com TypeScript, projetado para atuar como uma **camada central de orquestração, governança e segurança** entre agentes de IA, ferramentas internas, automações e serviços externos.

O projeto não é limitado a uma única plataforma. O n8n é utilizado como **uma das ferramentas integradas**, servindo como prova prática de criação e execução de automações, mas a arquitetura foi pensada para suportar **múltiplas tools**, agentes e integrações ao longo do tempo.

---

## Objetivo do Projeto

- Implementar um MCP Server centralizado
- Expor ferramentas MCP via API REST
- Integrar agentes de IA com ferramentas externas
- Controlar permissões por API key e escopo
- Orquestrar automações e serviços diversos
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

---

## Arquitetura Geral

```
Cliente / Agente de IA
        |
        | (API Key + Scopes)
        v
     MCP Server
        |
        | (Credenciais específicas por tool)
        v
   Ferramentas externas
   (n8n, APIs, serviços futuros)
```

A IA não acessa ferramentas externas diretamente. Toda interação passa pelo MCP Server, que decide o que pode ser executado.

---

## Estrutura do Projeto

O projeto foi migrado para TypeScript para maior segurança e escalabilidade.

```
src/
├── middlewares/       # Validadores e segurança (Auth, Rate Limit)
├── services/          # Serviços externos (OpenAI, etc)
├── tools/             # Ferramentas expostas via MCP (n8n, AI, etc)
├── types/             # Definições de tipos TypeScript (Contratos)
├── index.ts           # Ponto de entrada
└── mcpServer.ts       # Configuração do servidor Express
```

A pasta `tools` é extensível e pode receber integrações com qualquer tipo de serviço ou automação.

---

## Execução

### Pré-requisitos

- Node.js (v18+)
- Docker (opcional)

### Desenvolvimento Local

1. Instalar dependências:
   ```bash
   npm install
   ```
2. Rodar em modo dev:
   ```bash
   npm run dev
   ```

### Produção

1. Build do projeto:
   ```bash
   npm run build
   ```
2. Iniciar servidor:
   ```bash
   npm start
   ```

### Docker

Subir o ambiente:

```bash
docker compose up -d
```

Ver logs:

```bash
docker compose logs -f mcp-server
```

---

## Segurança e Governança

### Múltiplas API Keys

O acesso ao MCP Server é controlado por múltiplas API keys, definidas via variável de ambiente.

Cada chave possui:

- Nome
- Status ativo ou inativo
- Lista de escopos permitidos

Exemplo conceitual:

```json
[
  { "name": "admin", "scopes": ["*"] },
  { "name": "automation-tool", "scopes": ["workflow:run"] },
  { "name": "ai-agent", "scopes": ["ai:use", "workflow:generate"] }
]
```

---

### Scopes por Rota

Cada endpoint exige um escopo específico, garantindo que cada integração tenha acesso apenas ao necessário.

Exemplos de escopos:

- workflow:run
- workflow:generate
- ai:use
- admin:*

---

### Rate Limit

Um middleware de rate limit é aplicado às rotas protegidas para evitar abuso e uso indevido das ferramentas.

---

## Ferramentas Disponíveis

### Execução de automações

Permite disparar automações externas através do MCP Server, atualmente demonstrado com integração ao n8n.

### Criação dinâmica de automações

Permite criar automações de forma programática, a partir de estruturas JSON ou comandos em linguagem natural.

### Agente baseado em IA

Um endpoint experimental permite que agentes de IA gerem estruturas de automação a partir de texto, delegando a execução ao MCP Server.

---

## Extensibilidade

A arquitetura foi desenhada para facilitar a adição de novas tools, como:

- Integrações com APIs externas
- Serviços internos
- Ferramentas de infraestrutura
- Outros motores de automação
- Novos agentes especializados

Nenhuma ferramenta externa é acessada diretamente pela IA.

---

## Domínios Utilizados

- mcp.camiloruas.dev
- n8n.camiloruas.dev
- webhook.camiloruas.dev

---

## Autor

Camilo Ruas

GitHub: https://github.com/Camiloruas
LinkedIn: https://www.linkedin.com/in/camilo-ruas-3a2a6425/
Portfólio: [camiloruas.dev](https://www.camiloruas.dev/)

Este projeto está em evolução contínua e serve como base para estudos, automações e aplicações reais utilizando MCP, IA e integração de serviços.
