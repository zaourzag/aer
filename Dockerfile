FROM node:12-alpine

WORKDIR /opt/aero/aero

COPY package*.json ./

RUN npm ci

COPY . .

CMD [ "npm", "start" ]
