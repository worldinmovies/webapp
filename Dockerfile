# build environment
FROM node:21-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json package-lock.json tsconfig.json vite.config.ts ./

RUN npm ci --silent
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine-slim
ENV TZ=Europe/Stockholm
COPY --from=build /app/dist /usr/share/nginx/html
# new

COPY ./nginx/.htpasswd					/etc/nginx/.htpasswd
COPY ./nginx/sites-enabled/app2.conf	/etc/nginx/conf.d/default.conf
COPY ./nginx/certs/local-cert.pem  			/etc/letsencrypt/live/worldinmovies.duckdns.org/fullchain.pem
COPY ./nginx/certs/local-key.pem    			/etc/letsencrypt/live/worldinmovies.duckdns.org/privkey.pem

# Replace self-signed certs with real ones if existing
COPY nginx/certs/live/worldinmovies.duckdns.org/fakefile \
    nginx/certs/live/worldinmovies.duckdns.org/fullchain.pe? \
    nginx/certs/live/worldinmovies.duckdns.org/privkey.pe? \
    /etc/letsencrypt/live/worldinmovies.duckdns.org/

EXPOSE 80

HEALTHCHECK  --interval=5m --timeout=2s --start-period=3s --retries=0 CMD nc -v -w1 localhost 80

CMD ["nginx", "-g", "daemon off;"]
