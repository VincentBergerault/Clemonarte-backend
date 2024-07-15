FROM node:latest

WORKDIR /usr/myapp/
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE $PORT
CMD ["npm", "run", "start"]