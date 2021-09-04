FROM node:16.8-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npx prisma migrate --name users
RUN node src/utils/build-commands.js
COPY . .
EXPOSE 8080
CMD [ "npx", "pm2", "start", "pm2.json" ]