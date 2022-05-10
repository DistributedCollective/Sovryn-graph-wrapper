FROM node:12-alpine AS base

WORKDIR /app

# ---------- Builder ----------
# Creates:
# - node_modules: production dependencies (no dev dependencies)
# - dist: A production build compiled with Babel
FROM base AS builder

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npm run codegen

RUN npm run build

# Remove dev dependencies
RUN npm prune --production 

# ---------- Release ----------
FROM base AS release

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "./dist/src/server.js"]
