FROM node:latest

WORKDIR /usr/myapp/
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE $BACKEND_PORT
CMD ["npm", "run", "start"]