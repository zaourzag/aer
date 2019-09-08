FROM node:12-alpine

WORKDIR /opt/aero/aero

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
