FROM node:latest

WORKDIR /app
COPY package.json yarn.lock /app/

RUN npm install -g yarn firebase-tools npm-run-all
RUN yarn install

COPY ./ /app/

CMD [ "run-s", "fetch", "build:translator", "deploy:translator", "build:docs", "deploy:docs" ]
