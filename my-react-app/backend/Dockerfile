# Use Node.js Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy app files
COPY . .

# Expose port
EXPOSE 4000

# Start the backend
CMD ["node", "src/server.js","--host", "0.0.0.0"]
