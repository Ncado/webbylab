FROM node:latest  AS builder
#RUN apk add --no-cache libc6-compat

WORKDIR ./usr/src/

COPY package.json yarn.lock ./
RUN yarn install
COPY . .

RUN yarn build


FROM node:latest as runner

WORKDIR ./usr/src/

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

COPY --from=builder ./usr/src/dist/ ./dist

EXPOSE 3000

CMD ["node", "dist/main"]


