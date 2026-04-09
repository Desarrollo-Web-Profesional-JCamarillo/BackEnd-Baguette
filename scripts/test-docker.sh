#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔥 Prueba de Fuego - El Guardián de la API"
echo "=========================================="

# Prueba 1: Redirección HTTP -> HTTPS
echo -e "\n${YELLOW}📡 Prueba 1: Redirección HTTP a HTTPS${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ "$HTTP_CODE" = "301" ]; then
    echo -e "${GREEN}✅ Redirección funciona (HTTP 301 -> HTTPS)${NC}"
else
    echo -e "${RED}❌ Redirección falló (código: $HTTP_CODE)${NC}"
fi

# Prueba 2: XSS Sanitization
echo -e "\n${YELLOW}🛡️ Prueba 2: Sanitización XSS${NC}"
XSS_RESPONSE=$(curl -s -k -X POST https://localhost/api/v1/commentarios \
  -H "Content-Type: application/json" \
  -d '{"puntuacion":5,"texto":"<script>alert(\"hack\")</script>"}')
  
if echo "$XSS_RESPONSE" | grep -q "&lt;script&gt;"; then
    echo -e "${GREEN}✅ XSS sanitizado correctamente${NC}"
else
    echo -e "${RED}❌ Posible vulnerabilidad XSS${NC}"
fi

# Prueba 3: Rate Limiting
echo -e "\n${YELLOW}⏱️ Prueba 3: Rate Limiting (15 peticiones)${NC}"
for i in {1..15}; do
    STATUS=$(curl -s -k -o /dev/null -w "%{http_code}" -X POST https://localhost/api/v1/commentarios \
      -H "Content-Type: application/json" \
      -d '{"puntuacion":3,"texto":"test"}')
    
    if [ "$STATUS" = "429" ]; then
        echo -e "   Petición $i: ${RED}429 Too Many Requests${NC}"
        break
    elif [ "$STATUS" = "201" ]; then
        echo -e "   Petición $i: ${GREEN}201 Created${NC}"
    fi
done

# Prueba 4: TLS 1.3
echo -e "\n${YELLOW}🔒 Prueba 4: Verificando TLS 1.3${NC}"
TLS_OK=$(echo | openssl s_client -connect localhost:443 -tls1_3 2>&1 | grep -c "TLSv1.3" || true)
if [ "$TLS_OK" -gt 0 ]; then
    echo -e "${GREEN}✅ TLS 1.3 está habilitado${NC}"
else
    echo -e "${RED}❌ TLS 1.3 no disponible${NC}"
fi

echo -e "\n✅ Prueba de Fuego Completada"