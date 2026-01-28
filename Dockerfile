FROM fholzer/nginx-brotli
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/

#CMD ["bash"]
