# Stage 1: Build
FROM node:22 AS build
WORKDIR /app

# Accept VITE_API_URL as a build argument
ARG VITE_API_URL
# Set it as an environment variable for the build process
ENV VITE_API_URL=$VITE_API_URL

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy everything and build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built files from build stage
COPY --from=build /app/dist .

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
