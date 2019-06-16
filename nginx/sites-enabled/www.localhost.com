server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;

        server_name www.localhost.com;
        include snippets/self-signed-certs.config;
        include snippets/ssl-params.config;

        location / {
                include snippets/reverse-proxy.config;
                proxy_pass http://www.w.kd-krsko.si/;
        }

        access_log /var/log/nginx/www.localhost.com-access.log;
        error_log /var/log/nginx/www.localhost.com-error.log warn;
}

