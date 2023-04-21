FROM node:18-alpine as base

WORKDIR /app

COPY package.json package-lock.json ./

RUN rm -rf node_modules && npm ci && npm cache clean --force

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 80
