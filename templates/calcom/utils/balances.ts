import { client } from "./client"

// ABI for the balanceOf function of ERC-20 tokens
const balanceOfABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
] as const;

export const balances = async (ownerAddresses: any, contract: any) => {
    let calls = []
    let hasNFT = false
    for (let i = 0; i < ownerAddresses.length; i++) {
        calls.push({
            address: contract,
            abi: balanceOfABI,
            functionName: 'balanceOf',
            args: [ownerAddresses[i]],
        })
    }
    const results = await client.multicall({
        contracts: calls,
    })
    for (let i = 0; i < results.length; i++) {
        if (results[i].result && results[i].result?.toString() !== "0") {
            hasNFT = true
            break
        }
    }
    return hasNFT
}