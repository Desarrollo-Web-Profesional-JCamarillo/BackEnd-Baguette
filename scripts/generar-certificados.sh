#!/bin/bash

set -e

echo "🔐 Generando certificados SSL autofirmados..."

mkdir -p nginx/ssl

openssl req -x509 -newkey rsa:4096 \
  -keyout nginx/ssl/nginx.key \
  -out nginx/ssl/nginx.crt \
  -days 365 \
  -nodes \
  -subj "/C=MX/ST=CDMX/L=CDMX/O=Baggete/OU=Dev/CN=localhost"

chmod 600 nginx/ssl/nginx.key
chmod 644 nginx/ssl/nginx.crt

echo "✅ Certificados generados en nginx/ssl/"