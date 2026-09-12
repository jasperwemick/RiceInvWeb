#  Dockerfile for Node Express Backend

FROM node:22.16.0 AS builder
WORKDIR /usr/src/backend
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build

FROM node:22.16.0-alpine
WORKDIR /usr/src/backend
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/src/backend/dist ./dist
EXPOSE 4000
CMD ["node", "dist/server.js"]