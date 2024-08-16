#  Dockerfile for Node Express Backend

FROM node:20.9.0

# Create a directory  and go to the directory 
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy the package.json file to my current directory to install the necessary dependence  
COPY package.json .

# Install the dependence
RUN npm install --silent

# Copy other files to my current directory
COPY . .

# Open the port for the express server
EXPOSE 4000

# Run express rum in the foreground
CMD ["npm", "start"]