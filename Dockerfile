FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY backend/package*.json ./

# Instalar dependencias
RUN npm ci --omit=dev

# Copiar código fuente (src Y bd)
COPY backend/src ./src
COPY backend/src/bd ./bd
COPY backend/src/test ./test

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3001

# Exponer puerto interno
EXPOSE 3001

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

CMD ["node", "src/index.js"]