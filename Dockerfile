FROM node:14.16.1-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

EXPOSE 4000

CMD ["node" ,"index.js"]


