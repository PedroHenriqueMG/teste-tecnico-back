###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install

COPY . /usr/src/app

RUN npm run prisma:generate

USER node

###################
# PRODUCTION
###################

FROM node:20-alpine As production

COPY --chown=node:node --from=development /usr/src/app/ ./

EXPOSE 8080

CMD [ "npm", "run", "start" ]