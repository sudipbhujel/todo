FROM node:18-alpine as development

# Add time zone
RUN apk add --no-cache tzdata

# Set time zone
ENV TZ=Asia/Kathmandu

RUN set -x \
  && apk update \
  && apk upgrade 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force && rm -rf node_modules && npm install

# RUN npm install

COPY . .

FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN cd src && npx prisma generate

RUN cd src && npx prisma migrate dev --name todo

RUN npm run build

# Run the app
FROM node:18-alpine as production

# Add time zone
RUN apk add --no-cache tzdata

# Set time zone
ENV TZ=Asia/Kathmandu

RUN set -x \
  && apk update \
  && apk upgrade 

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main"]