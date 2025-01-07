# STAGE 1
FROM node:18-alpine as builder

WORKDIR /app
COPY package.json ./
RUN yarn
COPY . /app
RUN yarn build

# STAGE 2
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]