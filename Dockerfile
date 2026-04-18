FROM nginx:alpine

# Copiar la configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados de Angular
COPY ./dist/foodtrack/browser/. /usr/share/nginx/html/

EXPOSE 80