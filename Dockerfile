FROM node as backend
WORKDIR /app
COPY ./backend .
RUN yarn install

FROM nginx
WORKDIR /app
COPY ./frontend/dist /usr/share/nginx/html
COPY --from=backend /app .
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./docker/start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
RUN apt-get update && \
    apt-get install -y nodejs npm
ENTRYPOINT [ "start.sh" ]
