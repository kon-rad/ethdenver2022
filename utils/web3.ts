import { ExternalProvider, getNetwork, JsonRpcFetchFunc } from "@ethersproject/providers"
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers"

export const injected = new InjectedConnector({
    supportedChainIds: [
        1, // mainnet
        4, // rinkeby
        137, // polygon
        1337, // local hardhat node
        31337, // local hardhat
        80001, // mumbai
    ]
})

export function getProvider(provider: ExternalProvider | JsonRpcFetchFunc) {
    return new Web3Provider(provider)
}

export function formatAddress(value: string, length: number = 4) {
    return `${value.substring(0, length + 2)}...${value.substring(value.length - length)}`
}

// import { Network } from "@ethersproject/networks";

// export const matic: Network = {
//     name: 'matic',
//     chainId: 137,
//     _defaultProvider: (providers) => new providers.JsonRpcProvider('rpc-url')
// }

// // import those networks where ever you want to use it with getDefaultProvider
// const provider = ethers.getDefaultProvider(matic);