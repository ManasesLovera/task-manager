# Stage 1: Build
FROM node:22 AS build
WORKDIR /app

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
