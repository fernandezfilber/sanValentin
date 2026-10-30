# ---- Etapa 1: dependencias ----
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar solo los manifiestos primero (mejor cache)
COPY package.json package-lock.json ./

# Instalar solo dependencias de producción
RUN npm ci --omit=dev

# ---- Etapa 2: imagen final ----
FROM node:20-alpine AS runner

WORKDIR /app

# Metadatos
LABEL maintainer="sanvalentin"
LABEL description="Página web romántica - Para Ti 💕"

# Usuario no-root por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copiar dependencias ya instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY package.json ./
COPY server.js ./
COPY public/ ./public/

# Dar permisos al usuario
RUN chown -R appuser:appgroup /app

USER appuser

# Puerto expuesto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1

# Arrancar
CMD ["node", "server.js"]
