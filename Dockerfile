FROM node as backend
COPY ./backend .
RUN yarn install

FROM nginx
WORKDIR /usr/share/nginx/html
COPY ./frontend/dist .
# TODO: move backend directory
COPY --from=backend . .
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./docker/start.sh /usr/bin/start.sh
RUN chmod +x /usr/bin/start.sh
RUN apt-get update && \
    apt-get install -y nodejs npm
ENTRYPOINT [ "start.sh" ]
