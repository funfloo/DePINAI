#!/bin/bash

echo "=================================================="
echo "🚀 INITIALISATION DU NŒUD WORKER DEPIN AI 🚀"
echo "=================================================="

# 1. Vérification et installation de Node.js
if ! command -v node &> /dev/null; then
    echo "📦 Installation de Node.js (Prérequis)..."
    apt-get update -y > /dev/null
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null
    apt-get install -y nodejs > /dev/null
fi

# 2. Vérification et installation d'Ollama
if ! command -v ollama &> /dev/null; then
    echo "🧠 Installation d'Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh > /dev/null
fi

# 3. Démarrage d'Ollama (Spécifique aux conteneurs Vast.ai)
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "⚙️ Démarrage du service Ollama en arrière-plan..."
    ollama serve > /dev/null 2>&1 &
    sleep 5 # Laisser le temps à l'API de démarrer
fi

# 4. Vérification et téléchargement du modèle Mistral
echo "🔍 Vérification du modèle Mistral..."
if ! ollama list | grep -q "mistral"; then
    echo "📥 Téléchargement du modèle Mistral (cela peut prendre quelques minutes)..."
    ollama pull mistral
else
    echo "✅ Modèle Mistral déjà présent."
fi

# 5. Création du dossier de travail
mkdir -p depin-node && cd depin-node

# 6. Téléchargement des scripts depuis GitHub (avec anti-cache)
echo "📥 Téléchargement des fichiers du nœud..."
curl -so worker.js "https://raw.githubusercontent.com/funfloo/DePINAI/main/install/worker.js?v=$RANDOM"
curl -so register.js "https://raw.githubusercontent.com/funfloo/DePINAI/main/install/register.js?v=$RANDOM"

# 7. L'interrogatoire (Configuration)
echo ""
read -p "🔑 Clé privée du Wallet (sans '0x') : " PRIVATE_KEY < /dev/tty
read -p "🔐 Authtoken Ngrok : " NGROK_TOKEN < /dev/tty
read -p "🌐 Domaine fixe Ngrok (ex: mon-nœud.ngrok-free.app) : " NGROK_DOMAIN < /dev/tty

# 8. Installation des dépendances NPM
echo "⏳ Installation des dépendances systèmes (NPM)..."
npm init -y > /dev/null
npm install express cors ethers dotenv > /dev/null
npm install -g pm2 ngrok > /dev/null

# 9. Création du fichier caché .env
echo "PRIVATE_KEY=$PRIVATE_KEY" > .env
echo "RPC_URL=https://ethereum-sepolia-rpc.publicnode.com" >> .env

# 10. Authentification Ngrok
ngrok config add-authtoken $NGROK_TOKEN > /dev/null

# 11. Lancement silencieux en arrière-plan (PM2)
echo "⚙️ Démarrage des processus en arrière-plan..."
pm2 start "ngrok http --url=$NGROK_DOMAIN 3000" --name "ngrok-tunnel"
pm2 start worker.js --name "depin-worker"
pm2 save > /dev/null

# 12. Inscription automatique sur la Blockchain
echo "🔗 Enregistrement sur le Smart Contract..."
node register.js $NGROK_DOMAIN

echo "=================================================="
echo "✅ FÉLICITATIONS ! VOTRE NŒUD EST ACTIF ET ENREGISTRÉ."
echo "Pour voir les logs de votre IA en direct, tapez : pm2 logs"
echo "=================================================="
