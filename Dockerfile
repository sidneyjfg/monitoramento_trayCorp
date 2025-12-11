# ============================
# 1️⃣ STAGE: BUILD
# ============================
FROM node:18 AS builder

WORKDIR /app

# Copia package antes (mais cache)
COPY package*.json ./

RUN npm install

# Copia o resto do projeto
COPY . .

# Compila Typescript
RUN npm run build

# ============================
# 2️⃣ STAGE: RUN (PRODUÇÃO)
# ============================
FROM node:18-slim

WORKDIR /app

# Copia somente node_modules e dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
