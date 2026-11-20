FROM node:22-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

# Copy all source files
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile=true

# Set environment variables for Next.js build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG BOOTSTRAP_ADMIN_EMAIL
ARG BOOTSTRAP_ADMIN_PASSWORD
ENV BOOTSTRAP_ADMIN_EMAIL=$BOOTSTRAP_ADMIN_EMAIL
ENV BOOTSTRAP_ADMIN_PASSWORD=$BOOTSTRAP_ADMIN_PASSWORD

# Build Web and its dependencies
RUN pnpm run build --filter=web...

ENV WEB_PORT=3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

# Start standard Next.js production server
CMD ["pnpm", "--filter=web", "start"]
