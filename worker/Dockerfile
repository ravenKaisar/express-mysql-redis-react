FROM node:18-alpine

RUN mkdir -p  /worker
WORKDIR /worker

COPY . /worker

RUN yarn install 

CMD [ "node", "worker.js" ]