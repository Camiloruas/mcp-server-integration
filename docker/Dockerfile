# Dockerfile placeholder
# Etapa base
FROM node:20-slim

# Definindo o diretório de trabalho
WORKDIR /usr/src/app

# Instalando dependências
COPY package*.json ./
RUN npm install

# Copiando código-fonte
COPY . .

# Expondo a porta do servidor
EXPOSE 3333

# Comando para rodar o servidor
CMD ["node", "src/index.js"]
