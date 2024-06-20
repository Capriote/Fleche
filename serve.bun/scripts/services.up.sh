#! /bin/bash
compose_file="docker/dev.docker-compose.yaml"
project_name="${1:-app}"

echo "starting services: $project_name"

docker-compose \
  --project-name=$project_name \
  --project-directory=../ \
  --env-file=.env \
  -f $compose_file \
  up -d
