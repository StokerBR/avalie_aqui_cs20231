#!/bin/sh

# wait-for-postgres.sh
until PGPASSWORD=avalieaqui PGUSER=avalieaqui PGHOST=postgres-avalieaqui PGDATABASE=avalieaqui psql -c '\q'; do
  >&2 echo "Postgres não está disponível - esperando"
  sleep 1
done

>&2 echo "Postgres carregado"
bash -c "npx prisma migrate dev"
bash -c "npm run seed:docker"
exec "$@"