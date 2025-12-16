# MCP Server Integration

Este repositório demonstra a **integração de um MCP Server (Model Context Protocol)** com **OpenAI**, **n8n** e outros serviços, rodando em ambiente **Docker**, com foco em **aprendizado prático**, **arquitetura real** e **boas práticas de backend**.

O projeto foi desenvolvido como um **ambiente real de estudos**, simulando cenários de produção: uso de containers, variáveis de ambiente, fallback de IA, timeout, retry e observabilidade básica.

---

## Objetivo do Projeto

- Implementar um **MCP Server** centralizado em Node.js
- Expor ferramentas MCP via REST
- Integrar o MCP com:
  - **OpenAI** (IA externa, com fallback automático)
  - **n8n** (orquestração de workflows)
- Demonstrar:
  - uso correto de Docker e Docker Compose
  - controle de variáveis de ambiente
  - resiliência (fallback, timeout, retry)
  - documentação clara e profissional

---

## O que é um MCP Server?

O **Model Context Protocol (MCP)** é um padrão que permite que agentes de IA utilizem **ferramentas externas** de forma organizada, reutilizável e desacoplada.

Com um MCP Server, você consegue:

- Centralizar integrações
- Expor ferramentas reutilizáveis (APIs, webhooks, serviços)
- Usar o mesmo servidor para múltiplos agentes ou automações

Em vez de cada agente ou fluxo falar diretamente com cada serviço, **tudo passa pelo MCP Server**.

---

## Arquitetura Geral

```text
[ Cliente / IA / Automação ]
            |
            v
     [ MCP Server ]
            |
            +--> OpenAI (IA externa)
            +--> n8n (Workflows)
            +--> APIs / Serviços
```

O MCP atua como **camada intermediária**, responsável por:
- decidir qual tool usar
- tratar falhas externas
- padronizar respostas

---

## Estrutura do Projeto

```bash
mcp-server/
├── docker/
│   └── Dockerfile
├── docker-compose.yml
├── docs/
├── src/
│   ├── index.js
│   ├── mcpServer.js
│   └── tools/
│       ├── ai.js
│       ├── aiInfo.js
│       ├── ping.js
│       ├── callN8nWebhook.js
│       └── n8n.js
├── .env.example
├── README.md
```

---

## Execução com Docker

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

### Health Check

```http
GET /
```
Retorna o status do MCP Server.

---

### Ping

```http
GET /tools/ping
```
Teste simples de conectividade.

---

### Integração com n8n

```http
POST /tools/n8n
```

Permite disparar webhooks do n8n a partir do MCP Server.

---

### Tool de IA (OpenAI + Mock)

```http
POST /tools/ai
```

Características:
- Suporte a OpenAI real
- Fallback automático para **mock** em caso de erro
- Timeout generoso
- Retry controlado

---

### Diagnóstico da IA

```http
GET /tools/ai/info
```

Exemplo de resposta:

```json
{
  "tool": "ai",
  "mode": "openai",
  "model": "gpt-4.1-nano",
  "openaiEnabled": true,
  "timestamp": "2025-12-16T13:16:21.099Z"
}
```

Esse endpoint **não consome tokens** e é usado para diagnóstico e monitoramento.

---

## Containers em Execução (Ambiente Real)

O projeto roda em um servidor self-hosted, com múltiplos containers gerenciados via **Portainer**.

### Visão Geral dos Containers

> A imagem abaixo mostra os containers ativos no ambiente real, incluindo MCP Server, n8n, Redis, Postgres e Portainer.

<!-- IMAGEM: Containers rodando no Portainer -->

![Containers rodando no Portainer](docs/images/portainer.png)


---

## Domínios Utilizados

- `mcp.camiloruas.dev`
- `n8n.camiloruas.dev`
- `portainer.camiloruas.dev`

A exposição externa é feita via **Cloudflare Tunnel**.

---

## Boas Práticas Aplicadas

- `.env` não versionado
- `.env.example` para referência
- Containers isolados
- Fallback automático de IA
- Timeout e retry controlados
- Código organizado por responsabilidade

---

## Próximas Etapas

- [ ] Novas tools (Redis, Postgres)
- [ ] Autenticação de endpoints
- [ ] Observabilidade (logs estruturados)
- [ ] Testes automatizados

---

## Autor

**Camilo Ruas**  
Desenvolvedor Web | Automação | IA | n8n | MCP

- GitHub: https://github.com/Camiloruas
- LinkedIn: https://www.linkedin.com/in/camilo-ruas-3a2a6425/

---

## Observação Final

Este projeto reflete um **ambiente real de estudos e experimentação**, com decisões técnicas baseadas em problemas reais enfrentados no dia a dia.

_Projeto em constante evolução._

