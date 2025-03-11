# Stage 1: Development
FROM node:18-alpine AS development

WORKDIR /app

# Install Wasp CLI
RUN apk add --no-cache curl bash
RUN curl -sSL https://get.wasp-lang.dev/installer.sh | bash -s -- -v 0.16.0

# Add Wasp to PATH
ENV PATH="/root/.local/bin:${PATH}"

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose ports
EXPOSE 3000 3001

# Start the application in development mode
CMD ["wasp", "start"]

# Stage 2: Build
FROM development AS build

# Build the application
RUN wasp build

# Stage 3: Production
FROM node:18-alpine AS production

WORKDIR /app

# Copy built application from the build stage
COPY --from=build /app/.wasp/build/web-app ./

# Install production dependencies
RUN npm install --production

# Expose port
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "start"]
