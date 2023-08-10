FROM alpine as builder
WORKDIR /data
RUN apk add --no-cache zola
COPY . .
RUN zola build

FROM nginx:alpine
COPY --from=builder /data/public/ /usr/share/nginx/html/
