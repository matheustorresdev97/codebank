FROM postgres:13.22-alpine3.21

RUN deluser postgres && \
    addgroup -g 1000 postgres && \
    adduser -D -u 1000 -G postgres postgres
