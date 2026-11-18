FROM nginx:alpine

COPY index.html styles.css app.js estadisticas.js /usr/share/nginx/html/

EXPOSE 80
