###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /home/node/kizola

# RUN apt-get update && apt-get install -y

COPY --chown=node:node package*.json ./

COPY --chown=node:node . .

RUN npm ci

RUN npm run prisma:generate

USER node

CMD ["npm", "run", "start:dev"]

EXPOSE 3000