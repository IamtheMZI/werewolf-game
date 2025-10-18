# Multi-stage build for optimized production image

# Stage 1: Build stage (if needed for any preprocessing)
FROM node:18-alpine AS builder
WORKDIR /app

# Install git to get commit info
RUN apk add --no-cache git

COPY . .

# Generate version.js at build time with actual git commit
RUN COMMIT_SHA=$(git rev-parse HEAD 2>/dev/null || echo "unknown") && \
    BUILD_DATE=$(date -u +"%Y-%m-%d") && \
    cat > /app/js/version.js << EOF
// Auto-generated version file
// Built: ${BUILD_DATE}

export const VERSION = {
    number: '1.0.0',
    commit: '${COMMIT_SHA}',
    date: '${BUILD_DATE}'
};

// Update version display on page load
document.addEventListener('DOMContentLoaded', () => {
    const versionElements = document.querySelectorAll('#app-version');
    const versionString = \\\`\\\${VERSION.number}-\\\${VERSION.commit.substring(0, 7)}\\\`;

    versionElements.forEach(el => {
        el.textContent = versionString;
        el.title = \\\`Built on \\\${VERSION.date} | Commit: \\\${VERSION.commit}\\\`;
    });
});
EOF

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
