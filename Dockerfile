###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /home/node/kizola

COPY --chown=node:node package*.json ./
COPY --chown=node:node .env ./
COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node . .

RUN npm i -g @nestjs/cli

RUN npm i prisma -D --save-exact --save-dev

RUN npm ci

RUN npx prisma generate --schema=./src/database/schema.prisma

USER node

CMD ["npm", "run", "start:dev"]
EXPOSE 3000