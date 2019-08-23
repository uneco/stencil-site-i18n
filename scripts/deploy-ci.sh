#!/bin/bash

aws s3 sync "s3://${CONFIG_BUCKET}/config" ./config
cat << EOS > ./deploy.env
FIREBASE_TOKEN=${FIREBASE_TOKEN}
GITHUB_TOKEN=${GITHUB_TOKEN}
EOS
docker-compose run deploy
