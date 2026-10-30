# 💕 San Valentín - Para Ti

Página web romántica interactiva con animaciones modernas (GSAP, tsParticles, Swiper), reproductor de música con saltos a los mejores momentos, diseño ultra-responsive para móviles y soporte para Docker.

---

## 🚀 Despliegue en VPS

### Opción 1: Despliegue directo con Docker Compose (Recomendado)

1. **Subir el proyecto al VPS**:
   ```bash
   scp -r /ruta/local/sanValentin usuario@tu_vps_ip:/home/usuario/
   ```

2. **Entrar al VPS y ejecutar**:
   ```bash
   cd /home/usuario/sanValentin
   docker compose up -d --build sanvalentin
   ```

3. **Acceder a la web**:
   - Abre tu navegador en: `http://TU_IP_VPS:3000`

---

### Opción 2: Con Dominio y HTTPS (Nginx Proxy)

1. Pon tus certificados SSL (`fullchain.pem` y `privkey.pem`) en `./nginx/certs/`.
2. Edita `nginx/nginx.conf` con tu nombre de dominio.
3. Levanta todo junto:
   ```bash
   docker compose --profile with-nginx up -d --build
   ```

---

## 🎵 Gestión de Música y Fotos

Los volúmenes están mapeados directamente:
- **Canciones:** Puedes agregar canciones `.mp3` en `./public/music/` y la web las detecta sin necesidad de reconstruir la imagen de Docker.
- **Imágenes:** Están en `./public/images/`.

---

## 🛠️ Comandos útiles

- **Ver logs en tiempo real:**
  ```bash
  docker compose logs -f sanvalentin
  ```
- **Reiniciar el contenedor:**
  ```bash
  docker compose restart sanvalentin
  ```
- **Detener el servicio:**
  ```bash
  docker compose down
  ```
