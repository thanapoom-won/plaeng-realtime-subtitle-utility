FROM node:16.13.1-alpine AS base
WORKDIR /user/src/app
COPY package.json .
RUN yarn
COPY . .

FROM base AS build
COPY --from=base /user/src/app .
RUN yarn build

FROM node:16.13.1-alpine AS release
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=build /user/src/app/public ./public
COPY --from=build /user/src/app/node_modules ./node_modules
COPY --from=build /user/src/app/.next ./.next
COPY --from=build /user/src/app/package.json ./package.json
USER nextjs
EXPOSE 3000
CMD ["yarn", "start"]
