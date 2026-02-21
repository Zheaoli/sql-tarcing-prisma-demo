#!/bin/sh
set -e

echo "Running migrations..."
pnpm run migrate

echo "Running seed..."
pnpm run seed

echo "Starting app..."
exec pnpm run start
