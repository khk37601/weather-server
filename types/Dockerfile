FROM node:16.14.2

RUN apt-get update
RUN mkdir -p ./app \
    && mkdir -p /var/log/weather  
RUN chmod 777 /var/log/weather

COPY .  /app

WORKDIR /app

RUN npm install -g npm@8.5.5 
RUN npm i -s
RUN npm i -s koa @koa/cors koa-router koa-body koa-bodyparser dotenv winston winston-daily-rotate-file morgan ps-node-promise-es6 lodash axios
RUN npm i -s -g pm2
CMD ["pm2-runtime", "start", "main.js", "--name", "weather-api","-i", "3"]