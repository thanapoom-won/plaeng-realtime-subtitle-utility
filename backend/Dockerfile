FROM node:16.13.1-alpine AS base
WORKDIR /user/src/app
COPY package.json .
RUN yarn
COPY . .

FROM base AS build
COPY --from=base /user/src/app .
RUN yarn build

FROM node:16.13.1-alpine AS release
COPY --from=build /user/src/app/node_modules ./node_modules
COPY --from=build /user/src/app/dist ./dist
COPY --from=build /user/src/app/package.json .
EXPOSE 8080
CMD [ "yarn", "start:prod"]