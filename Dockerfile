FROM node:22.13.1-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "pnpm build && pnpm start"]