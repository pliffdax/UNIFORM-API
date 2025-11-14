FROM node:22-alpine AS runner
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.16.0 --activate

RUN pnpm config set allow-scripts true

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm prisma generate && pnpm build

ENV NODE_ENV=production
ENV PORT=3000
CMD sh -c "pnpm prisma migrate deploy && node dist/main.js"
