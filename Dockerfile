FROM node:10

WORKDIR /opt/aero/aero

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
