# Stage 1: Build the React application
FROM node:20-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the built assets from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

# When the container starts, nginx is started by default.
# Expose port 80
EXPOSE 80

# The default nginx command is ["nginx", "-g", "daemon off;"] which is what we want.
