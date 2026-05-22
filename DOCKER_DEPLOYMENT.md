# FoodTrack Frontend Docker deployment

Este despliegue ejecuta solo el frontend usando una imagen publicada.

Primero debe estar corriendo el backend, porque este frontend usa la red Docker `foodtrack-network` y proxy hacia el servicio `backend`.

## Publicar imagen

```powershell
docker login

cd C:\Users\jacob\Desktop\Frontend_FoodTrack
docker build -t tu_usuario/foodtrack-frontend:latest .
docker push tu_usuario/foodtrack-frontend:latest
```

## Ejecutar

Renombra `.env.production.example` a `.env` y cambia `DOCKERHUB_USERNAME`.

Luego:

```powershell
docker compose -f docker-compose.prod.yml up -d
```

Abre:

```text
http://localhost:4200
```

Para apagar:

```powershell
docker compose -f docker-compose.prod.yml down
```
