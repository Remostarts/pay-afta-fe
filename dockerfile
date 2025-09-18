FROM node:20.13.1-alpine

WORKDIR /app

COPY . .

RUN npm install --force

RUN npm run build

EXPOSE 3000

RUN ["chmod", "+x", "./entrypoint.sh"]

ENTRYPOINT [ "sh", "./entrypoint.sh" ]