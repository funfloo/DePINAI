const { ethers } = require('ethers');
const fs = require('fs');

const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const CONTRACT_ADDRESS = "0x94C4b77Be4Aa4a6180480a8999bfBDf16257596F";
const ABI = [
  "function getAllProviders() external view returns (address[])",
  "function providers(address) external view returns (bool isRegistered, string endpoint, uint256 pricePerChar)"
];

async function main() {
    let suggestedPrice = 10; // Prix de base s'il n'y a personne

    try {
        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const addresses = await contract.getAllProviders();

        let total = 0n;
        let count = 0;

        for (const addr of addresses) {
            const info = await contract.providers(addr);
            if (info[0]) {
                total += info[2];
                count++;
            }
        }

        if (count > 0) {
            suggestedPrice = Math.floor(Number(total) / count);
            console.log(`\n📊 INFO MARCHÉ : Le prix moyen actuel est de ${suggestedPrice} wei par caractère.`);
        } else {
            console.log(`\n📊 INFO MARCHÉ : Vous êtes le premier fournisseur ! Prix de base suggéré : 10 wei.`);
        }
    } catch (e) {
        console.log(`\n📊 INFO MARCHÉ : Récupération impossible. Prix de base défini sur 10 wei.`);
    }

    // On écrit le prix suggéré dans un fichier caché pour que Bash puisse le lire
    fs.writeFileSync('.suggested_price', suggestedPrice.toString());
}

main();
