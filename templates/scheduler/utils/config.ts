import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'

// const privateKey = process.env.NEXT_PUBLIC_KEY
// if (!privateKey) {
//     throw new Error('Private key is not defined')
// }
// console.log('private key : ' + privateKey)

const account = privateKeyToAccount(
    '0xd6912910ad4b09bb62377b0e3c0681bc1f030e15fe3c8d4e0ffb2832dae8b1ec' as `0x${string}`
)

export const client = createWalletClient({
    account,
    chain: baseSepolia,
    transport: http(),
})
