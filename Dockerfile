FROM node:25-trixie

RUN apt-get update -y && apt-get install -y openssl git && rm -rf /var/lib/apt/lists/*
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Clone and build prisma fork
RUN git init && \
    git submodule add -b sql-comment-exp https://github.com/Zheaoli/prisma.git prisma-fork
RUN cd prisma-fork && pnpm install && pnpm build

RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/
COPY query-engine ./query-engine/
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/query-engine/libquery_engine.so.node
RUN npx prisma generate

COPY . .
RUN pnpm run build

EXPOSE 8084

CMD ["pnpm", "run", "start"]
