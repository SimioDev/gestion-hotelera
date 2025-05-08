#!/bin/bash

echo "Levantando contenedores Docker..."
docker compose up -d

echo "Matando instancias previas de ngrok..."
pkill -f 'ngrok' || true

echo "Iniciando ngrok - tunel a puerto 3000..."
ngrok http 3000 > ngrok.log 2>&1 &
NGROK_PID=$!
sleep 10

NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

if [ -z "$NGROK_URL" ]; then
  echo "Error: No se pudo obtener la URL de ngrok"
  kill $NGROK_PID
  cat ngrok.log
  exit 1
fi

echo "URL de ngrok: $NGROK_URL"

echo "Actualizando archivos de la app móvil..."
cd hoteleria-mobile

export EXPO_PUBLIC_NGROK_URL=http://localhost:4040/api/tunnels
node update-ngrok-url.js

echo "Iniciando el servidor de Expo..."
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  source "$HOME/.nvm/nvm.sh"
  nvm use 20
fi
npx expo start --tunnel