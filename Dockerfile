FROM node:12-alpine

RUN apk add git python g++ make pkgconf cairo-dev jpeg-dev pango-dev giflib-dev

RUN ln -sf pkgconf /usr/bin/pkg-config

WORKDIR /opt/aero/aero

COPY package*.json ./

ENV CXXFLAGS="-w" 

RUN npm ci --loglevel=error

COPY . .

CMD [ "npm", "start" ]
