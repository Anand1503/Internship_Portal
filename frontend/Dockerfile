# === Stage 1: Build the React/Vite Application ===
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# === Stage 2: Serve the Built Application with Nginx ===
FROM nginx:stable-alpine AS production

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Set environment variables for nginx
ENV NGINX_PORT=80
ENV NGINX_HOST=0.0.0.0

# Create a non-root user and set permissions
RUN adduser -D -u 1001 nginxuser && \
    chown -R nginxuser:nginxuser /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /run && \
    chmod -R 755 /var/log/nginx /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxuser /var/run/nginx.pid

# Switch to non-root user
USER nginxuser

# Expose the port nginx is running on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]