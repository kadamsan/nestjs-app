FROM node:12.19.0-alpine3.9 AS development

WORKDIR /usr/src/app

COPY package*.json ./

ARG NODE_ENV
RUN echo "NODE_ENV: $NODE_ENV"
ARG DATABASE_HOST
RUN echo "Postgres DATABASE_HOST: $DATABASE_HOST"

RUN npm install glob rimraf
RUN npm ci

COPY . .

CMD ["npm", "run" , "start:dev"]

FROM node:12.19.0-alpine3.9 As staging

WORKDIR /usr/src/app

COPY package*.json ./

ARG NODE_ENV
RUN echo "NODE_ENV: $NODE_ENV"

RUN npm install glob rimraf
RUN npm install --only=production

COPY . .

CMD ["npm", "run" , "start:stage"]


FROM node:12.19.0-alpine3.9 As production

WORKDIR /usr/src/app

COPY package*.json ./

ARG NODE_ENV
RUN echo "NODE_ENV: $NODE_ENV"

RUN npm install glob rimraf
RUN npm install --only=production

COPY . .

CMD ["npm", "run" , "start:prod"]
