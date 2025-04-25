# ===== 第一階段：建構階段 =====
FROM node:18-alpine AS builder

WORKDIR /app
COPY app/package.json ./
RUN npm install --omit=dev

COPY app/index.js ./

# ===== 第二階段：運行階段 =====
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app /app

EXPOSE 3000
CMD ["node", "index.js"]
