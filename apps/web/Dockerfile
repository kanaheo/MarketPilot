FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder

WORKDIR /app

ENV AUTH_SECRET=build-time-placeholder
ENV AUTH_GOOGLE_ID=build-time-placeholder
ENV AUTH_GOOGLE_SECRET=build-time-placeholder
ENV MARKETPILOT_API_URL=http://api:8000
ENV MARKETPILOT_INTERNAL_API_TOKEN=build-time-placeholder
ENV MARKETPILOT_USER_API_SIGNING_SECRET=build-time-placeholder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM node:24-alpine AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
