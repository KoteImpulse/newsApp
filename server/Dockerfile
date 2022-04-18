FROM node:14-alpine
WORKDIR /work/app
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build
COPY ./img/defaultAvatars /work/app/dist/static/defaultAvatars
EXPOSE 5000
CMD ["node", "dist/main"]