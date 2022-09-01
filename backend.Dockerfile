FROM node:18-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# copy both 'package.json' and 'package-lock.json' (if available)
COPY apps/backend/package*.json ./apps/backend/
COPY packages/common/package*.json ./packages/common/

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY tsconfig-base.json .
COPY apps/backend apps/backend
COPY packages/common packages/common

WORKDIR /app/apps/backend
# build app for production with minification

EXPOSE 3000
CMD ["npm", "run", "start"]
