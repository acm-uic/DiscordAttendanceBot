ARG NODE_VERSION=16.10.0

FROM node:${NODE_VERSION}

ENV NODE_ENV=production
WORKDIR /app
COPY ./dist /app/
RUN cd /app \
    && npm install --production

ENTRYPOINT [ "node" ]
CMD [ "/app/index.js" ]