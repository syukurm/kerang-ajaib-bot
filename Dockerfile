## build runner
FROM node:lts-alpine as build-runner

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json pnpm-lock.yaml ./

# Enable pnpm via corepack
RUN corepack enable

# Install dependencies
RUN pnpm install --frozen-lockfile

# Move source files
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json   .

# Build project
RUN pnpm generate
RUN pnpm build

## producation runner
FROM node:lts-alpine as prod-runner

# Set work directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml from build-runner
COPY --from=build-runner /tmp/app/package.json ./package.json
COPY --from=build-runner /tmp/app/pnpm-lock.yaml ./pnpm-lock.yaml

# Enable pnpm via corepack
RUN corepack enable

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy and generate prisma stuff
COPY --from=build-runner /tmp/app/prisma ./prisma
RUN pnpm dlx prisma generate

# Move built files
COPY --from=build-runner /tmp/app/dist ./dist

# Start bot
CMD [ "pnpm", "start" ]
