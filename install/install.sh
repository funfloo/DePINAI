#!/bin/bash

echo "=================================================="
echo "🚀 INITIALISATION DU NŒUD WORKER DEPIN AI 🚀"
echo "=================================================="

# 0. Vérification et installation de Node.js
if ! command -v node &> /dev/null
then
    echo "📦 Installation de Node.js (Prérequis)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null
    apt-get install -y nodejs > /dev/null
fi

# 1. Création du dossier de travail
mkdir -p depin-node && cd depin-node

# 2. Téléchargement des scripts depuis ton GitHub
echo "📥 Téléchargement des fichiers du nœud..."
curl -sO https://raw.githubusercontent.com/funfloo/DePINAI/main/install/worker.js
curl -sO https://raw.githubusercontent.com/funfloo/DePINAI/main/install/register.js

# 3. L'interrogatoire (Configuration) - Le </dev/tty permet de lire le clavier même avec un curl|bash
echo ""
read -p "🔑 Clé privée du Wallet (sans '0x') : " PRIVATE_KEY < /dev/tty
read -p "🔐 Authtoken Ngrok : " NGROK_TOKEN < /dev/tty
read -p "🌐 Domaine fixe Ngrok (ex: mon-nœud.ngrok-free.app) : " NGROK_DOMAIN < /dev/tty

# 4. Installation de l'environnement
echo "⏳ Installation des dépendances systèmes..."
npm init -y > /dev/null
npm install express cors ethers dotenv > /dev/null
npm install -g pm2 ngrok > /dev/null

# 5. Création du fichier caché .env
echo "PRIVATE_KEY=$PRIVATE_KEY" > .env
echo "RPC_URL=https://ethereum-sepolia-rpc.publicnode.com" >> .env

# 6. Authentification Ngrok
ngrok config add-authtoken $NGROK_TOKEN > /dev/null

# 7. Lancement silencieux en arrière-plan (PM2)
echo "⚙️ Démarrage des processus en arrière-plan..."
pm2 start "ngrok http --domain=$NGROK_DOMAIN 3000" --name "ngrok-tunnel"
pm2 start worker.js --name "depin-worker"
pm2 save > /dev/null

# 8. Inscription automatique sur la Blockchain
echo "🔗 Enregistrement sur le Smart Contract..."
node register.js $NGROK_DOMAIN

echo "=================================================="
echo "✅ FÉLICITATIONS ! VOTRE NŒUD EST ACTIF."
echo "Pour voir les logs de votre IA en direct, tapez : pm2 logs"
echo "=================================================="
