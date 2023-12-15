FROM node:21.2.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

WORKDIR /app/api

CMD ["npm","run","start"]
