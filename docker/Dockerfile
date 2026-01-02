FROM node:20-alpine

# Criar usuário não-root
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Copiar manifests
COPY package*.json ./

# Instalar TODAS as dependências (inclui typescript)
RUN npm install

# Copiar código-fonte e config TS
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Remover devDependencies após o build (opcional, mas elegante)
RUN npm prune --omit=dev

# Ajustar permissões
RUN chown -R app:app /app

USER app

EXPOSE 3333

CMD ["node", "dist/index.js"]
