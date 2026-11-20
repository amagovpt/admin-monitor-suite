FROM node:20-alpine AS base 
WORKDIR /app
COPY package*.json ./


RUN npm ci

FROM base AS development


COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM base AS builder
ARG VITE_ROUTE_URL
ARG VITE_ROUTE_URL_ABB
ARG VITE_API_URL
ARG VITE_API_VERSION
ENV VITE_ROUTE_URL="${VITE_ROUTE_URL}"
ENV VITE_ROUTE_URL_ABB="${VITE_ROUTE_URL_ABB}"
ENV VITE_API_URL="${VITE_API_URL}"
ENV VITE_API_VERSION="${VITE_API_VERSION}"

COPY . .
RUN npm run build:noenv

FROM httpd:alpine AS production
ARG VITE_ROUTE_URL
ARG VITE_ROUTE_URL_ABB
ARG VITE_API_URL
ARG VITE_API_VERSION
ARG MONITOR_SERVER_URL
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/#LoadModule proxy_module/LoadModule proxy_module/' /usr/local/apache2/conf/httpd.conf && \
    sed -i 's/#LoadModule proxy_http_module/LoadModule proxy_http_module/' /usr/local/apache2/conf/httpd.conf && \
    sed -i '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /usr/local/apache2/conf/httpd.conf && \
    printf '\nAllowEncodedSlashes NoDecode\n' >> /usr/local/apache2/conf/httpd.conf


RUN printf '%s\n' \
    '<LocationMatch "/notifications/stream">' \
    "    ProxyPass ${MONITOR_SERVER_URL}/v2/notifications/stream flushpackets=on connectiontimeout=5 timeout=3600" \
    "    ProxyPassReverse ${MONITOR_SERVER_URL}/v2/notifications/stream" \
    '    SetEnv no-gzip 1' \
    '    SetEnv proxy-nokeepalive 0' \
    '    Header always set Cache-Control "no-cache, no-transform"' \
    '    Header always set X-Accel-Buffering "no"' \
    '</LocationMatch>' >> /usr/local/apache2/conf/httpd.conf
WORKDIR /usr/local/apache2/htdocs/ams

COPY --from=builder /app/dist /usr/local/apache2/htdocs/ams

COPY --from=builder /app/.htaccess /usr/local/apache2/htdocs/ams

RUN printf '%s\n' \
    '#!/bin/sh' \
    'TARGET_FILE="/usr/local/apache2/htdocs/config.json"' \
    'echo "=== Generating Runtime Configuration ==="' \
    'cat << EOF > "$TARGET_FILE"' \
    '{' \
    '  "NODE_ENV": "${NODE_ENV:-production}",' \
    '  "VITE_API_URL": "${VITE_API_URL}",' \
    '  "VITE_API_VERSION": "${VITE_API_VERSION}",' \
    '  "VITE_ROUTE_URL": "${VITE_ROUTE_URL}",' \
    '  "VITE_ROUTE_URL_ABB": "${VITE_ROUTE_URL_ABB}",' \
    '}' \
    'EOF' \
    'echo "=== Configuration generated ==="' \
    'exec "$@"' > /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["httpd-foreground"]
