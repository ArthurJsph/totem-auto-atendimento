FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./public

EXPOSE 3000

CMD ["serve", "-s", "public", "-l", "3000"]