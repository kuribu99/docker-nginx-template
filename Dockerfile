FROM nginx
EXPOSE 80 443

LABEL name="docker-nginx-template"
LABEL version="1.0.0"

### Copy all system configs
WORKDIR /etc/systemd/system/multi-user/target.wants/
COPY systemd/*.service .
RUN ls -l


### Copy all nginx configs
WORKDIR /etc/nginx/
COPY nginx/snippets snippets
COPY nginx/sites-enabled sites-enabled
COPY nginx/nginx.conf nginx.conf


### Run test
RUN service nginx configtest
