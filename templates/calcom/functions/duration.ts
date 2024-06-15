'use server'
import type { BuildFrameData, FrameActionPayload } from '@/lib/farcaster'
import type { Config, State } from '..'
import PageView from '../views/Duration'
import NotSatisfied from '../views/NotSatisfied'
import { init, fetchQuery } from '@airstack/node'

export default async function duration(
    body: FrameActionPayload,
    config: Config,
    state: State,
    params: any
): Promise<BuildFrameData> {
    init(process.env.AIRSTACK_API_KEY || '')
    console.log(body.trustedData)

    let containsUserFID = true
    let nftGate = true
    if (config.karmaGating) {
        const url = 'https://graph.cast.k3l.io/scores/personalized/engagement/fids?k=1&limit=1000'
        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: `["${config.fid}"]`,
        }

        try {
            const response = await fetch(url, options)
            const data = await response.json()

            containsUserFID = data.result.some((item: any) => item.fid === body.untrustedData.fid)
        } catch (error) {
            console.log(error)
        }
    }
    if (config.nftGating) {
        const query = `query MyQuery {
  TokenBalances(
    input: {filter: {tokenAddress: {_eq: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"}}, blockchain: ethereum, limit: 1}
  ) {
    TokenBalance {
      owner {
        socials(
          input: {filter: {dappName: {_eq: farcaster}, userAssociatedAddresses: {_in: "0x2eee539ceb2026a0bf44ff3e7dbc6f8ee3ce47ee"}}}
        ) {
          userId
          profileName
          userAddress
          userAssociatedAddresses
        }
      }
    }
  }
}`

        const { data, error } = await fetchQuery(query)
        console.log(data)
        if (
            data.TokenBalances.TokenBalance === null
            // data.TokenBalances.TokenBalance?.owner?.socials?.userId !== body.untrustedData.fid
        ) {
            nftGate = false
        }
    }

    if (!containsUserFID || !nftGate) {
        return {
            buttons: [],
            component: NotSatisfied(config),
            functionName: 'initial',
        }
    }
    return {
        buttons: [
            {
                label: '15min',
            },
            {
                label: '30min',
            },
        ],

        component: PageView(config),
        functionName: 'date',
    }
}
