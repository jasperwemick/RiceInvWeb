# Dockerfile for React client

# Build react client
FROM node:20.9.0

# Working directory be app
WORKDIR /usr/src/app

COPY package*.json ./

###  Installing dependencies

RUN npm install --silent

# copy local files to app folder
COPY . .

EXPOSE 80

CMD ["npm","start"]