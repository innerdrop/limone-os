#!/bin/bash
# Fix www redirect for tallerlimone.com

# Add www redirect server block
cat > /etc/nginx/sites-available/www-tallerlimone.com << 'EOF'
# Redirect www to non-www
server {
    listen 80;
    server_name www.tallerlimone.com;
    return 301 https://tallerlimone.com$request_uri;
}

server {
    listen 443 ssl;
    server_name www.tallerlimone.com;
    ssl_certificate /etc/letsencrypt/live/tallerlimone.com-0001/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tallerlimone.com-0001/privkey.pem;
    return 301 https://tallerlimone.com$request_uri;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/www-tallerlimone.com /etc/nginx/sites-enabled/www-tallerlimone.com

# Test config
nginx -t && systemctl reload nginx && echo "OK: Nginx recargado con www redirect"
