#!/bin/bash

# Build latest version of the blog.
hugo --minify

# Get current date.
curdate=`date +'%m-%d-%Y'`

# Build docker image.
docker build -t thoughts .

# Tag and push to Docker Hub.
docker tag thoughts zquestz/thoughts:latest
docker tag thoughts zquestz/thoughts:$curdate
docker push zquestz/thoughts:latest
docker push zquestz/thoughts:$curdate

# Restart kubernetes deployment.
kubectl rollout restart deployment/thoughts