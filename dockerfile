# Step 1: Build the React app
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve with nginx
FROM nginx:1.25-alpine

RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

# ⚠️ IMPORTANT: Vite builds to /dist not /build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]