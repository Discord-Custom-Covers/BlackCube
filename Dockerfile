FROM node:16.8-alpine

ADD package.json /tmp/package.json

# Remove the old build directory
RUN rm -rf build

# Install the dependancies
RUN cd /tmp && npm install -q

ADD ./ /src

# Copy to dependancies to the src directory
RUN rm -rf /src/node_modules && cp -a /tmp/node_modules /src/

WORKDIR /src

# Run the built application
CMD node src/utils/build-commands.js && npx pm2-runtime start pm2.json