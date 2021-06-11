FROM node:14.16.1-alpine AS BUILD_IMAGE

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

FROM node:14.16.1-alpine

COPY --from=BUILD_IMAGE /usr/src/app/dist ./
COPY --from=BUILD_IMAGE /usr/src/app/package.json ./
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

EXPOSE 4000

CMD ["node","index.js"]