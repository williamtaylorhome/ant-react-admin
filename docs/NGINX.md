# Nginx configuration reference
This is just a reference file, and you can configure it according to your own project needs

## A domain name corresponds to a single project
### Directory structure
```
.
├── /usr/local/nginx/html                 
│   ├── static
│   ├── index.html
│   └── favicon.ico
```

### nginx arrangement
```nginx
# The address of the backend service
upstream api_service {
  server xxx.xxx.xxx.xxx:xxxx;
  keepalive 2000;
}

server {
    listen      80;
    server_name www.shubin.wang shubin.wang; # Domain name address
    root        /usr/local/nginx/html; # Front-end static file directory
    location / {
      index index.html;
      try_files $uri $uri/ /index.html; #react-router Prevent page refreshes from appearing 404
    }

    # Static file caching，enable Cache-Control: max-age、Expires
    location ~ ^/static/(css|js|media)/ {
      expires 10y;
      access_log off;
      add_header Cache-Control "public";
    }

     # Proxy AJAX requests   Front-end AJAX requests start with /api
    location ^~/api {
       rewrite ^/api/(.*)$ /$1 break; # If the backend interface does not start with the API, remove the API prefix
       proxy_pass http://api_service/;
       proxy_set_header Host  $http_host;
       proxy_set_header Connection close;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-Server $host;
    }
}
```

## One domain name corresponds to multiple projects
Multiple projects can be attached to the same domain name by subdirectory

When the front-end project is built,Add BASE_NAME PUBLIC_URL parameters
```bash
BASE_NAME=/project1 PUBLIC_URL=/project1 yarn build
```
### nginx Static file directory structure
```
.
├── /home/ubuntu/react-admin                 
│   ├── build   // Main project  Static file directories
│   │   ├── static
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── project1   // Static directory of subprojects  Name with location /project1 location ~ ^/project1/static/.*  Configure correspondence
│   │   ├── static
│   │   ├── index.html
│   │   └── favicon.ico
```

### nginx arrangement
```nginx
upstream api_service {
  server xxx.xxx.xxx.xxx:xxxx;
  keepalive 2000;
}

upstream api_service_project1 {
  server xxx.xxx.xxx.xxx:xxxx;
  keepalive 2000;
}
server {
    listen 80;
    server_name www.shubin.wang shubin.wang; # Domain name address
    # Allow file uploads
    client_max_body_size 100M;

    # Master project configuration
    location / {
        root /home/ubuntu/react-admin/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    # static file caching,enable Cache-Control: max-age、Expires
    location ~ ^/static/.* {
        root /home/ubuntu/react-admin/build;
        expires 20y;
        access_log off;
        add_header Cache-Control "public";
    }
    # Proxy AJAX requests  Front-end AJAX requests start with /api
    location ^~/api {
       rewrite ^/api/(.*)$ /$1 break; # If the backend interface does not start with the API, remove the API prefix
       proxy_pass http://api_service/;
       proxy_set_header Host  $http_host;
       proxy_set_header Connection close;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-Server $host;
    }

    # Subproject configuration
    location /project1 {
        root /home/ubuntu/react-admin;
        index index.html;
        try_files $uri $uri/ /project1/index.html;
    }
    # static file caching,enable Cache-Control: max-age、Expires
    location ~ ^/project1/static/.* {
        root /home/ubuntu/react-admin;
        expires 10y;
        access_log off;
        add_header Cache-Control "public";
    }
    # Proxy AJAX requests   Front-end AJAX requests start with /project1_api
    location ^~/project1_api {
       rewrite ^/api/(.*)$ /$1 break; # If the backend interface does not start with the API, remove the API prefix
       proxy_pass http://api_service_project1/;
       proxy_set_header Host  $http_host;
       proxy_set_header Connection close;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-Server $host;
    }
}
```
