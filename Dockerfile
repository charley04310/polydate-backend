FROM node:14-alpine as dev

RUN npm install

COPY . /app
WORKDIR /app

EXPOSE 8090

CMD ["npm", "run", "dev"]

FROM node:14-alpine as runner


RUN npm install

COPY . /app
WORKDIR /app

EXPOSE 8090

CMD ["npm", "run", "dev"]


# FROM node:14-alpine as runner

 # RUN npm install

# COPY . /app
# WORKDIR /app

# RUN npm ci
# RUN npm run build

# EXPOSE 8090

 # CMD ["node", "build/index.js"]
