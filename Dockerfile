# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Point Nginx to index.html for SPA routing AND handle dynamic $PORT
RUN sed -i 's/listen  80;/listen ${PORT};/g' /etc/nginx/conf.d/default.conf
# Cloud Run injects $PORT at runtime, we use envsubst to replace it in nginx config
CMD ["sh", "-c", "sed -i \"s/80/${PORT:-80}/g\" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
