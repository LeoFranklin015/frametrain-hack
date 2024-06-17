import { client } from "./client"

// ABI for the balanceOf function of ERC-20 tokens
const balanceOfABI = [
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
    },
];


async function getBalance(contractAddress: any, ownerAddress: any) {
    const balance = await client.readContract({
        address: contractAddress,
        abi: balanceOfABI,
        functionName: 'balanceOf',
        args: [ownerAddress],
    });

    return balance;
}

export const balances = async (ownerAddress: any, contracts: any) => {
    let totalBalances = 0
    for (let contract in contracts) {
        const balance: any = await getBalance(contract, ownerAddress)
        totalBalances += balance
    }
    if (totalBalances == 0) {
        return false
    }
    else {
        return true
    }
}


// (async () => {
//     let ownerAddress = "0x5a6b842891032d702517a4e52ec38ee561063539"
//     let contracts = [
//         "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
//     ]
//     console.log(await balances(ownerAddress, contracts))
// })()