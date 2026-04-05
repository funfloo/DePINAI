***

# 🌐 DePIN AI - Decentralized AI Marketplace

Bienvenue sur le futur de l'Intelligence Artificielle décentralisée. DePIN AI est un réseau peer-to-peer permettant à n'importe qui de monétiser la puissance de sa carte graphique (GPU) en traitant des requêtes d'IA, et d'être payé instantanément en cryptomonnaie via des Smart Contracts.

Ce dépôt contient le script d'installation automatisé (One-Click) pour devenir un **Nœud Fournisseur (Worker)** sur le réseau.

---

## ✨ Fonctionnalités clés

* **Installation One-Click :** Un seul script Bash pour tout configurer (Node.js, Ollama, PM2, Ngrok).
* **Intelligence Artificielle Locale :** Utilise le modèle `Mistral` via Ollama pour garantir une confidentialité totale.
* **Paiements Web3 :** Connecté à la blockchain Ethereum (Sepolia). Vous êtes payé en tokens pour chaque caractère généré.
* **Tarification Dynamique :** Le script analyse la blockchain en temps réel pour vous suggérer le meilleur prix du marché.
* **Haute Disponibilité :** Les processus tournent en arrière-plan via `PM2` avec un tunnel persistant `Ngrok`.

---

## 🛠️ Prérequis avant l'installation

Avant de lancer l'installation sur votre machine (ou sur un serveur comme Vast.ai), assurez-vous d'avoir ces 3 éléments à portée de main :

1. **Une Clé Privée Ethereum :** La clé d'un portefeuille (MetaMask) contenant un peu de Sepolia ETH pour payer les frais de transaction (Gas) lors de l'inscription de votre nœud.
2. **Un Authtoken Ngrok :** Créez un compte gratuit sur [ngrok.com](https://ngrok.com) et récupérez votre jeton d'authentification.
3. **Un Domaine Ngrok Fixe :** Réclamez votre domaine statique gratuit sur votre tableau de bord Ngrok (ex: `votre-nom.ngrok-free.app`).

---

## 🚀 Installation Rapide (Worker Node)

Connectez-vous à votre machine ou votre serveur Linux (Ubuntu recommandé) et copiez-collez cette commande unique dans votre terminal :

```bash
curl -sL "https://raw.githubusercontent.com/funfloo/DePINAI/main/install/install.sh?v=$RANDOM" | bash
```

> **Note :** Le script s'arrêtera au milieu de l'installation pour vous demander vos informations (Clé privée, Token Ngrok, etc.) et le prix auquel vous souhaitez louer votre IA. Vous pouvez appuyer sur **Entrée** pour utiliser la moyenne actuelle du marché.

---

## ⚙️ Commandes utiles (Maintenance)

Votre nœud fonctionne désormais en arrière-plan de manière totalement autonome. Voici quelques commandes pour gérer votre machine :

* **Voir l'activité de votre IA en direct :**
  ```bash
  pm2 logs depin-worker
  ```
* **Voir l'état de votre connexion réseau :**
  ```bash
  pm2 logs ngrok-tunnel
  ```
* **Arrêter le nœud :**
  ```bash
  pm2 stop all
  ```
* **Redémarrer le nœud :**
  ```bash
  pm2 restart all
  ```

---

## 💸 Modifier votre tarif

Si vous souhaitez changer le prix de vos générations (pour être plus compétitif, par exemple), vous n'avez pas besoin de tout réinstaller. Placez-vous dans le dossier de travail et utilisez le script d'enregistrement :

```bash
cd ~/depin-node
node register.js VOTRE_DOMAINE_NGROK.ngrok-free.app NOUVEAU_PRIX_EN_WEI
```

*Exemple pour passer votre prix à 5 wei :*
`node register.js mon-noeud.ngrok-free.app 5`

---

## 🏗️ Architecture Technique

* **Smart Contracts :** Solidity / Ethers.js
* **Backend Worker :** Node.js / Express
* **Modèle IA :** Ollama (Mistral)
* **Réseau P2P :** Ngrok
* **Gestionnaire de processus :** PM2

***
