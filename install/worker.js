require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configuration Web3
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// L'ABI : On donne au script le "manuel" de ton contrat (juste la fonction dont il a besoin)
const contractABI = [
    "function completeTask(uint256 _taskId, uint256 _actualTotalChars) external"
];

// Connexion à la blockchain
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

// 2. Réception de la mission
app.post('/api/generate', async (req, res) => {
    const { taskId, prompt } = req.body;

    if (!taskId || !prompt) {
        return res.status(400).json({ error: "taskId et prompt requis" });
    }

    console.log(`\n🚀 Nouvelle tâche reçue ! Task ID: ${taskId}`);
    console.log(`📝 Prompt: "${prompt}"`);

    try {
        // 3. Demander à l'IA locale de travailler (Ollama sur le port 11434)
        console.log("🧠 Interrogation d'Ollama en cours...");
        const ollamaResponse = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "mistral", // Change par "llama3" ou autre selon ce que tu as sur Vast.ai
                prompt: prompt,
                stream: false
            })
        });

        const ollamaData = await ollamaResponse.json();
        const aiText = ollamaData.response;
        const charsCount = aiText.length;

        console.log(`✅ Réponse générée (${charsCount} caractères).`);

        // 4. Réclamer le paiement sur le Smart Contract
        console.log("💸 Réclamation du paiement en cours...");
        const tx = await contract.completeTask(taskId, charsCount);
        console.log(`⏳ En attente de validation par les mineurs... (Tx: ${tx.hash})`);

        await tx.wait(); // On attend que la transaction soit gravée
        console.log("💰 Paiement reçu avec succès sur le Wallet du Worker !");

        // 5. Renvoyer le texte final au client (l'interface web)
        res.json({
            success: true,
            response: aiText,
            txHash: tx.hash
        });

    } catch (error) {
        console.error("❌ Erreur pendant le processus :", error);
        res.status(500).json({ error: "Le nœud a rencontré une erreur technique." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🟢 DePIN Worker Node en ligne sur le port ${PORT}`);
    console.log(`🔗 Wallet du nœud : ${wallet.address}`);
    console.log(`📡 Prêt à recevoir des tâches et interroger Ollama.`);
});
