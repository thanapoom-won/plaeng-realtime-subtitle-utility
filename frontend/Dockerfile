FROM node:16.13.1-alpine AS base
WORKDIR /user/src/app
COPY package.json .
RUN yarn
COPY . .

FROM base AS build
COPY --from=base /user/src/app .
ENV NX_PORT = ${PORT}
EXPOSE ${PORT}
CMD [ "sh", "-c" , "yarn build && yarn start -p ${NX_PORT}"]