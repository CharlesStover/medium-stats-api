FROM node:alpine
LABEL Author "Charles Stover <medium-stats@charlesstover.com>"
WORKDIR /var/www
ENV ACCESS_CONTROL_ALLOW_ORIGIN https://charlesstover.com
COPY package.json yarn.lock ./
RUN yarn
COPY src ./src
EXPOSE 3010
ENTRYPOINT [ "node", "./src/medium-stats.js" ]
