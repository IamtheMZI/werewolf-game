# Multi-stage build for optimized production image

# Stage 1: Build stage (if needed for any preprocessing)
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .

# Stage 2: Production stage with Nginx
FROM nginx:alpine

# Copy application files to Nginx html directory
COPY --from=builder /app /usr/share/nginx/html

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/werewolf.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
