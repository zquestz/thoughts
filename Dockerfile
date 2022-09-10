FROM alpine:3.7
RUN apk add --update --no-cache curl bash

FROM fholzer/nginx-brotli
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/

#CMD ["bash"]
