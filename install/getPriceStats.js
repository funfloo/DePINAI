const { ethers } = require('ethers');

const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const CONTRACT_ADDRESS = "0x94C4b77Be4Aa4a6180480a8999bfBDf16257596F";
const ABI = [
  "function getAllProviders() external view returns (address[])",
  "function providers(address) external view returns (bool isRegistered, string endpoint, uint256 pricePerChar)"
];

async function main() {
    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const addresses = await contract.getAllProviders();

        let total = 0n;
        let count = 0;

        for (const addr of addresses) {
            const info = await contract.providers(addr);
            if (info[0]) { // Si le nœud est actif (isRegistered == true)
                total += info[2]; // On ajoute son pricePerChar
                count++;
            }
        }

        if (count > 0) {
            const avg = Number(total) / count;
            console.log(`\n📊 INFO MARCHÉ : Le prix moyen actuel est de ${avg.toFixed(2)} wei par caractère.`);
            console.log(`💡 Conseil : Proposez un prix légèrement inférieur pour attirer plus de requêtes !`);
        } else {
            console.log(`\n📊 INFO MARCHÉ : Vous êtes le premier fournisseur ! Aucun prix de référence.`);
        }
    } catch (e) {
        console.log(`\n📊 INFO MARCHÉ : Impossible de récupérer la moyenne (erreur réseau).`);
    }
}

main();
