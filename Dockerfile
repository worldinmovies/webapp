# build environment
FROM node:24-alpine AS build
WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH
COPY package.json package-lock.json tsconfig.json vite.config.ts ./

RUN npm ci --silent
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
ENV TZ=Europe/Stockholm
COPY --from=build /app/dist /usr/share/nginx/html
# new
RUN apk add --no-cache gettext

COPY ./nginx/.htpasswd				            /etc/nginx/.htpasswd
COPY ./nginx/sites-enabled/app.conf.template    /etc/nginx/conf.d/default.conf.template

EXPOSE 80

HEALTHCHECK  --interval=1m --timeout=5s --start-period=3s --retries=2 CMD wget --spider --no-verbose 127.0.0.1 >/dev/null 2>&1 || exit 1

#CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["sh", "-c", "envsubst '$TMDB_UPSTREAM' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]