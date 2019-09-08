FROM node:12-alpine

RUN apk add git

WORKDIR /opt/aero/aero

COPY package*.json ./

RUN npm ci

COPY . .

CMD [ "npm", "start" ]
