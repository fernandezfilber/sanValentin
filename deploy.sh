#!/bin/bash
# Script de despliegue rápido en VPS

echo "💕 Desplegando web San Valentín..."

# 1. Crear directorios si no existen
mkdir -p nginx/certs public/music public/images

# 2. Descargar o construir la imagen Docker
docker compose build --pull

# 3. Levantar contenedor en segundo plano
docker compose up -d sanvalentin

echo "✅ Despliegue completado!"
echo "🌐 Disponible en http://localhost:3000 o http://TU_IP_VPS:3000"
echo "Para ver logs: docker compose logs -f sanvalentin"
