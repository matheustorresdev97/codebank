FROM node:20.18.0-alpine

RUN apk add --no-cache bash gcompat libstdc++

RUN npm install -g @nestjs/cli@11.0.1

USER node

WORKDIR /home/node/app