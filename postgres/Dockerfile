FROM postgres:16-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    git \
    postgresql-server-dev-16 \
    libcurl4-gnutls-dev \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 https://github.com/DataDog/pg_tracing.git /tmp/pg_tracing \
    && cd /tmp/pg_tracing \
    && make -s \
    && make -s install \
    && rm -rf /tmp/pg_tracing

# Cleanup build deps
RUN apt-get purge -y build-essential git postgresql-server-dev-16 \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*
