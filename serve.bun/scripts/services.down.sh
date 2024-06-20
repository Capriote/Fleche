#! /bin/bash

compose_file="docker/dev.docker-compose.yaml"
project_name="${1:-app}"

echo "shutting down services: $project_name"

docker-compose \
  --project-name=$project_name \
  --project-directory=../ \
  -f $compose_file \
  down
