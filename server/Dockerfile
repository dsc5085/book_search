FROM node:carbon

# Setup Node.js
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./server
CMD [ "npm", "start" ]