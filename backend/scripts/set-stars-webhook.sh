#!/bin/bash

export $(grep -v -E '^#|^$' .env | xargs)

if [ -z "$BOT_TOKEN" ]; then
  echo "BOT_TOKEN is not set in .env"
  exit 1
fi

WEBHOOK_URL=$1
if [ -z "$WEBHOOK_URL" ]; then
  echo "Usage: ./scripts/set-stars-webhook.sh <WEBHOOK_URL>"
  exit 1
fi

curl -F "url=$WEBHOOK_URL" "https://api.telegram.org/bot$BOT_TOKEN/setWebhook"
