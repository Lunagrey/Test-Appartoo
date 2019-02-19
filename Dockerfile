FROM node:8.9-alpine
ENV NODE_ENV production
COPY package*.json ./
RUN npm install
WORKDIR /usr/src/app
COPY . .
CMD ./install.sh