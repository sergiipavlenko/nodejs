FROM node:20
WORKDIR /server
COPY src/ /server/src
COPY prisma/ /server/prisma
COPY package.json /server
RUN npm install
RUN npx prisma generate
