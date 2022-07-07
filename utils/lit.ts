import LitJsSdk from 'lit-js-sdk'
import { create as ipfsHttpClient } from 'ipfs-http-client'

const client = new LitJsSdk.LitNodeClient()
// const chain = 'polygon'
const chain = 'localhost'
// / todo: must use erc1155 - convert 
const standardContractType = 'ERC721'

class Lit {
    litNodeClient

    async connect() {
        await client.connect()
        this.litNodeClient = client
    }

    async encrypt(file: any, tokenAddress: string, tokenId: number) {
        if (!this.litNodeClient) {
            await this.connect()
        }

        const accessControlConditions = [
          {
            contractAddress: tokenAddress,
            standardContractType,
            chain,
            method: 'ownerOf',
            parameters: [
              tokenId
            ],
            returnValueTest: {
              comparator: '=',
              value: ':userAddress'
            }
          }
        ]

        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
        const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile(file)

        const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
            accessControlConditions,
            symmetricKey,
            authSig,
            chain,
        })

        const added = await client.add(encryptedFile);
        const encryptedFileIPFSHash = `${added.path}`;

        return {
            encryptedFileIPFSHash,
            encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
        }
    }
    async decrypt(encryptedFile, encryptedSymmetricKey, tokenAddress) {
        if (!this.litNodeClient) {
          await this.connect()
        }

        const accessControlConditions = [
            {
                contractAddress: tokenAddress,
                standardContractType,
                chain,
                method: 'ownerOf',
                parameters: [
                ':tokenId'
                ],
                returnValueTest: {
                comparator: '=',
                value: ':userAddress'
                }
            }
        ]
    
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
        const symmetricKey = await this.litNodeClient.getEncryptionKey({
          accessControlConditions,
          toDecrypt: encryptedSymmetricKey,
          chain,
          authSig
        })
    
        const decryptedString = await LitJsSdk.decryptString(
          encryptedFile,
          symmetricKey
        );
    
      return { decryptedString }
    }
}

export default new Lit()