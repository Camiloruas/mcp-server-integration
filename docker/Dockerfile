FROM node:20-alpine

# Criamos um usuário não-root (boa prática de segurança)
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Copia apenas o necessário primeiro (cache eficiente)
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm install --omit=dev

# Copia o restante do código
COPY . .

# Ajusta permissões
RUN chown -R app:app /app

USER app

EXPOSE 3000

CMD ["npm", "start"]
