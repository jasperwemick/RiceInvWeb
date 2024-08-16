# Dockerfile for React client

FROM node:20.9.0 AS builder

# Create a directory  and go to the directory 
WORKDIR /usr/src/app

# Copy the package.json file to my current directory to install the necessary dependence  
COPY package*.json ./

# Install the dependence
RUN npm install

# Copy other files to my current directory
COPY . .

# Build and optimize static file
RUN npm run build

# Stage-2
FROM nginx:1.25.2-alpine-slim

# Copy the static file to my Nginx folder to serve static contain
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# Open the port to react
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]