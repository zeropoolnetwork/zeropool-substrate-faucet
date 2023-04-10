FROM node:19 as backend
WORKDIR /app
COPY ./backend .
RUN yarn install

FROM nginx
RUN apt update
RUN apt install nodejs npm -y
WORKDIR /app
COPY ./frontend/dist /usr/share/nginx/html
COPY --from=backend /app .
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./docker/start.sh /usr/bin/start.sh
ENTRYPOINT [ "start.sh" ]
