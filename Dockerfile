# NodeJS Version 16
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy the application files
COPY . /usr/src/app/

# Install Node packages
RUN npm install --legacy-peer-deps

# Build the application
RUN npm run build

# Set environment variables
 ENV NODE_ENV=production
 ENV DB_USER=armviya
 ENV DB_PASSWORD=Manutd1122
 ENV DB_DATABASE=teatime
 ENV DB_HOST=db-teatime-mongo.mongocluster.cosmos.azure.com
 ENV DB_OPTIONS=tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000


# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
