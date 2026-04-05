import { ethers } from 'ethers';
import 'dotenv/config';

// L'adresse de ton Smart Contract sur Sepolia
const CONTRACT_ADDRESS = "0x94C4b77Be4Aa4a6180480a8999bfBDf16257596F";

const ABI = [
  "function registerProvider(string calldata _endpoint, uint256 _pricePerChar) external"
];

async function main() {
  // Le script Bash passera le domaine Ngrok en argument (process.argv[2])
  const domain = process.argv[2];

  if (!domain) {
    console.error("❌ Erreur : Le domaine Ngrok n'a pas été fourni au script.");
    process.exit(1);
  }

  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

  if (!privateKey) {
    console.error("❌ Erreur : Clé privée introuvable dans le fichier .env");
    process.exit(1);
  }

  // On formate l'URL finale
  const endpoint = `https://${domain}/api/generate`;
  const pricePerChar = 10; // Le prix que tu fixes (ex: 10 wei)

  try {
    console.log(`🔗 Connexion au réseau Sepolia...`);
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    console.log(`✍️ Inscription du nœud sur la blockchain : ${endpoint}`);
    const tx = await contract.registerProvider(endpoint, pricePerChar);

    console.log(`⏳ Attente de la validation par les mineurs (Tx: ${tx.hash})...`);
    await tx.wait();

    console.log(`✅ Nœud enregistré avec succès ! Le réseau DePIN peut maintenant vous envoyer des tâches.`);
  } catch (error) {
    console.error(`❌ Erreur critique lors de l'enregistrement :`, error.message);
    process.exit(1);
  }
}

main();