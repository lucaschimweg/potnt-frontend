FROM node:14-alpine AS builder

COPY src /app/src
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY tsconfig.json /app/tsconfig.json
COPY webpack.config.js /app/webpack.config.js
WORKDIR /app
RUN npm install .
RUN npm run-script build

FROM nginx:alpine AS runner
COPY --from=builder /app/.build /usr/share/nginx/html
