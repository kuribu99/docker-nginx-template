server {
        listen 80;
        listen [::]:80;

        server_name www.localhost.com;

        location /github {
                include snippets/reverse-proxy;
                proxy_set_header X-REMOTE-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $host;
                proxy_pass https://www.github.com;
        }
}

