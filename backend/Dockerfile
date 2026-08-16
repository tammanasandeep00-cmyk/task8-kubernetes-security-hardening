FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev && \
    chown -R node:node /app

COPY --chown=node:node server.js ./

USER node

EXPOSE 5000

CMD ["node", "server.js"]
