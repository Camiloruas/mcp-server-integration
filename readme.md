# MCP Server Integration

Este repositório demonstra a **integração de um MCP Server (Model Context Protocol)** com **n8n**, **Ollama** e outros serviços, rodando em ambiente **Docker**, com foco em **aprendizado prático**, **arquitetura moderna** .

O projeto foi pensado para mostrar, de forma clara como criar um **servidor MCP reutilizável**, capaz de expor ferramentas (tools) que podem ser consumidas por agentes de IA e fluxos automatizados.

---

## Objetivo do Projeto

- Implementar um **MCP Server** centralizado
- Integrar o MCP com:
  - **n8n** (orquestração de workflows)
  - **Ollama** (LLMs locais, sem custo)
  - Outros serviços via HTTP
- Demonstrar **boas práticas de arquitetura**, versionamento e documentação

---

## O que é um MCP Server?

O **Model Context Protocol (MCP)** é um padrão que permite que agentes de IA utilizem ferramentas externas de forma organizada e reutilizável.

Com um MCP Server você pode:

- Centralizar integrações
- Expor ferramentas reutilizáveis (ex: webhooks, APIs, bancos de dados)
- Usar o mesmo servidor para múltiplos agentes e automações

👉 Em vez de cada fluxo falar direto com cada serviço, **tudo passa pelo MCP**.

---

## Arquitetura Geral

```text
[ IA / LLM (Ollama) ]
        |
        v
[ MCP Server ]
        |
        +--> n8n Webhooks
        +--> APIs externas
        +--> Ferramentas locais
```

Documentação detalhada:

- [`docs/architecture.md`](docs/architecture.md)
- [`docs/mcp-overview.md`](docs/mcp-overview.md)

---

## Estrutura do Projeto

```bash
mcp-server-integration/
├── docker/
│   └── Dockerfile
├── docker-compose.yml
├── docs/
│   ├── architecture.md
│   └── mcp-overview.md
├── src/
│   ├── index.js
│   ├── mcpServer.js
│   └── tools/
│       ├── callN8nWebhook.js
│       └── ping.js
└── README.md
```

---

## Executando com Docker

### Pré-requisitos

- Docker
- Docker Compose

### Subir o ambiente

```bash
docker compose up -d
```

### Ver logs do MCP Server

```bash
docker compose logs -f mcp-server
```

---

## Ferramentas (Tools) Disponíveis

Exemplos de tools já implementadas:

- **ping** → Teste simples de conectividade
- **callN8nWebhook** → Dispara webhooks no n8n

Essas tools podem ser chamadas por agentes MCP ou fluxos automatizados.

---

## Integração com n8n

- O MCP Server pode chamar webhooks do n8n
- O n8n pode chamar endpoints do MCP
- Permite criar **agentes inteligentes orquestrados**

Exemplo de uso:

- IA recebe mensagem
- MCP decide qual tool usar
- n8n executa lógica complexa
- Resultado retorna para o agente

---

## Domínios Utilizados (Ambiente Real)

Este projeto roda em ambiente real com subdomínios:

- `n8n.camiloruas.dev`
- `webhook.camiloruas.dev`
- `portainer.camiloruas.dev`

> O MCP Server pode futuramente ser exposto em:
> `mcpserver.camiloruas.dev`

---

## Próximas Etapas

- [ ] Expor MCP Server via Cloudflare Tunnel
- [ ] Criar painel simples de status
- [ ] Adicionar autenticação
- [ ] Criar novas tools (DB, Redis, APIs)
- [ ] Integrar memória via Redis

---

## Autor

**Camilo Ruas**  
Desenvolvedor Web | Automação | IA | n8n | MCP

- GitHub: https://github.com/Camiloruas
- LinkedIn: https://www.linkedin.com/in/camilo-ruas-3a2a6425/

---

## Observação Importante

Este projeto é **100% educacional e prático**, utilizando apenas ferramentas locais ou gratuitas, sem custos com APIs pagas.

Ele reflete um ambiente real de estudos e experimentação, exatamente como usado no dia a dia.

---

_Projeto em constante evolução._
