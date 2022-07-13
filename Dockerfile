###################
# LOCAL DEVELOPMENT
###################

# Base image for development
FROM node:12.19.0-alpine3.9 As development

# Dockerfile ARG values. ARG is set in Compose file under the build key
ARG NODE_ENV
RUN echo "NODE_ENV: $NODE_ENV"

# Set NODE_ENV environment variable
ENV NODE_ENV ${NODE_ENV}

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY . .

###################
# BUILD FOR STAGING, PRODUCTION
###################

FROM node:12.19.0-alpine3.9 As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
# COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency.
RUN npm i @nestjs/cli

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Dockerfile ARG values. ARG is set in Compose file under the build key
ARG NODE_ENV
RUN echo "NODE_ENV: $NODE_ENV"

# Set NODE_ENV environment variable
ENV NODE_ENV ${NODE_ENV}

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production && npm cache clean --force

USER node

###################
# STAGING
###################

# Base image for staging
FROM node:12.19.0-alpine3.9 As staging

# Dockerfile ARG values. ARG is set in Compose file under the build key
ARG NODE_ENV
RUN echo "NODE_ENV: $NODE_ENV"

# Set NODE_ENV environment variable
ENV NODE_ENV ${NODE_ENV}

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

###################
# PRODUCTION
###################

# Base image for production
FROM node:18-alpine As production

# Dockerfile ARG values. ARG is set in Compose file under the build key
ARG NODE_ENV
RUN echo "NODE_ENV: $NODE_ENV"

# Set NODE_ENV environment variable
ENV NODE_ENV ${NODE_ENV}

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
