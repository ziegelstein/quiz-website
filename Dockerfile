FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY quiz-visualizer /var/www/data

EXPOSE 80
