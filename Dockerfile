FROM node:16-alpine3.16 AS build-layer

WORKDIR /opt/hinomori-bot
RUN apk add --no-cache python3 make g++
COPY ./package.json .
COPY ./package-lock.json .
RUN  npm ci

COPY . .
RUN npm run lint && \
    npm run test && \
    npm run build

RUN npm prune --production

FROM node:16-alpine3.16 AS service-layer

WORKDIR /opt/hinomori-bot
COPY --from=build-layer /opt/hinomori-bot/package.json .
COPY --from=build-layer /opt/hinomori-bot/package-lock.json .
COPY --from=build-layer /opt/hinomori-bot/LICENSE .
COPY --from=build-layer /opt/hinomori-bot/README.md .
COPY --from=build-layer /opt/hinomori-bot/node_modules ./node_modules
COPY --from=build-layer /opt/hinomori-bot/build ./build

CMD [ "npm", "run", "start" ]
