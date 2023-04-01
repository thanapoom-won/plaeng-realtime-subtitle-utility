FROM node:16.13.1-alpine AS base
WORKDIR /user/src/app
COPY package.json .
RUN yarn
COPY . .

FROM base AS build
COPY --from=base /user/src/app .
EXPOSE 443
CMD [ "sh", "-c" , "yarn build && yarn start -p 443"]