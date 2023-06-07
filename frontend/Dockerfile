FROM node:16.16.0 as node
WORKDIR /app
RUN npm install -g npm@9.7.1
COPY . .
RUN npm install
RUN npm run build --prod
FROM nginx:alpine
COPY --from=node /app/dist/Blog-Post-Frontend /usr/share/nginx/html
EXPOSE 80



# Other way but the above one is preffered with Angular
# FROM node:16.16.0 as node
# WORKDIR /app
# COPY ./package*.json ./
# RUN npm install -g npm@9.7.1
# RUN npm install
# COPY . .
# RUN npm run build --prod
# EXPOSE 4200
# CMD ["npm", "start", "--host", "0.0.0.0" ]