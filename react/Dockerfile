FROM node:18-alpine

CMD mkdir -p /app
WORKDIR /app

COPY . /app

RUN yarn install
RUN yarn build

ENV NODE_ENV production

EXPOSE 3000

CMD [ "npx", "serve", "build" ]