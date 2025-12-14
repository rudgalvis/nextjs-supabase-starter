#!/bin/bash

# Script to stop all running Docker containers

echo "Stopping all running Docker containers..."

# Get list of running container IDs
CONTAINERS=$(docker ps -q)

if [ -z "$CONTAINERS" ]; then
    echo "No running containers found."
    exit 0
fi

# Stop all running containers
docker stop $CONTAINERS

if [ $? -eq 0 ]; then
    echo "Successfully stopped all containers."
else
    echo "Error occurred while stopping containers."
    exit 1
fi
