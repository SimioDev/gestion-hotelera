FROM node:20-alpine

WORKDIR /app

RUN npm install -g @expo/ngrok@^4.1.0

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 19000 19001 19002 8081

CMD ["npx", "expo", "start", "--tunnel", "--port", "19000"]