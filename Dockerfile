## step 1
FROM node:12.18.0 as build
WORKDIR /tmp
COPY . .
RUN yarn
RUN yarn build
## step 2
FROM nginx:1.12.2
WORKDIR /usr/share/nginx/html
RUN rm -f *
COPY docs .