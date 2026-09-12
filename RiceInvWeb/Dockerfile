# Dockerfile for React client

FROM node:22.16.0 AS builder
WORKDIR /usr/src/frontend
COPY package*.json ./
RUN npm install --silent
COPY . .
RUN npm run build


FROM node:22.16.0-alpine
WORKDIR /usr/src/frontend
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/src/frontend/dist ./dist

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]