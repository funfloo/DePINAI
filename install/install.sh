#!/bin/bash

echo "=================================================="
echo "🚀 INITIALISATION DU NŒUD WORKER DEPIN AI 🚀"
echo "=================================================="

# 1. Création du dossier de travail
mkdir -p depin-node && cd depin-node

# 2. Téléchargement de tes scripts depuis ton GitHub
echo "📥 Téléchargement des fichiers du nœud..."
curl -sO https://raw.githubusercontent.com/funfloo/DePINAI/main/install/worker.js
curl -sO https://raw.githubusercontent.com/funfloo/DePINAI/main/install/register.js

# 3. L'interrogatoire (Configuration)
echo ""
read -p "🔑 Clé privée du Wallet (sans '0x') : " PRIVATE_KEY
read -p "🔐 Authtoken Ngrok : " NGROK_TOKEN
read -p "🌐 Domaine fixe Ngrok (ex: mon-nœud.ngrok-free.app) : " NGROK_DOMAIN

# 4. Installation de l'environnement (Node.js, PM2, Ngrok)
echo "⏳ Installation des dépendances systèmes..."
npm init -y > /dev/null
npm install express cors ethers dotenv > /dev/null
npm install -g pm2 ngrok > /dev/null

# 5. Création du fichier caché .env
echo "PRIVATE_KEY=$PRIVATE_KEY" > .env
echo "RPC_URL=https://ethereum-sepolia-rpc.publicnode.com" >> .env

# 6. Authentification Ngrok
ngrok config add-authtoken $NGROK_TOKEN

# 7. Lancement silencieux en arrière-plan (PM2)
echo "⚙️ Démarrage des processus en arrière-plan..."
pm2 start "ngrok http --domain=$NGROK_DOMAIN 3000" --name "ngrok-tunnel"
pm2 start worker.js --name "depin-worker"
pm2 save

# 8. Inscription automatique sur la Blockchain
echo "🔗 Enregistrement sur le Smart Contract..."
node register.js $NGROK_DOMAIN

echo "=================================================="
echo "✅ FÉLICITATIONS ! VOTRE NŒUD EST ACTIF."
echo "Pour voir ce qu'il se passe en direct, tapez : pm2 logs"
echo "=================================================="
