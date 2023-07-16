###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /home/node/kizola

COPY --chown=node:node package*.json ./
COPY --chown=node:node .env ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node . .

RUN npm ci

RUN npm run prisma:generate

USER node

CMD ["npm", "run", "start:dev"]
EXPOSE 3000