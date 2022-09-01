FROM node:18-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# copy both 'package.json' and 'package-lock.json' (if available)
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/common/package*.json ./packages/common/

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY tsconfig-base.json .
COPY apps/frontend apps/frontend
COPY packages/common packages/common

WORKDIR /app/apps/frontend
# build app for production with minification
RUN npm run build

EXPOSE 8080
CMD [ "http-server", "dist" ]