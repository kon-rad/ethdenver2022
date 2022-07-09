import LitJsSdk from 'lit-js-sdk'
import { create as ipfsHttpClient } from 'ipfs-http-client'
// var reader = new FileReader();
const client = new LitJsSdk.LitNodeClient()
// const chain = 'polygon'
const chain = process.env.NEXT_PUBLIC_NETWORK;
// / todo: must use erc1155 - convert 
const standardContractType = 'ERC721'

const IPFSClient = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0' as any);

class Lit {
    litNodeClient

    async connect() {
        await client.connect()
        this.litNodeClient = client
    }

    async encrypt(file: any, tokenAddress: string, authSig: any) {
        if (!this.litNodeClient) {
            await this.connect()
            console.log('--- lit node connected')
        }

        const accessControlConditions = [
          {
            contractAddress: tokenAddress,
            standardContractType,
            chain,
            method: 'balanceOf',
            parameters: [
              ':userAddress'
            ],
            returnValueTest: {
              comparator: '>',
              value: '0'
            }
          }
        ]

        // const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
        console.log(' --- checkAndSignAuthMessage authSig done ')

        const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile(file)
        // const { encryptedString, symmetricKey } = await LitJsSdk.encryptString('hello world LIT!!!!')
        console.log('--- file encrypted encryptFile - symmetricKey: ', symmetricKey);

        const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
            accessControlConditions,
            symmetricKey,
            authSig,
            chain,
        })

        console.log('--- key encrypted saveEncryptionKey: ', encryptedSymmetricKey);

        const added = await IPFSClient.add(encryptedFile);
        // const encryptedFileIPFSHash = `${added.path}`;
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        // const encryptedFileIPFSHash = encryptedString;
        // console.log('--- encryptedFile added to ipfs: ', encryptedString);

        return {
            encryptedFileIPFSHash: (url),
            encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
        }
    }
    async decrypt(encryptedFile: any, encryptedSymmetricKey: string, tokenAddress: any) {
        if (!this.litNodeClient) {
          await this.connect()
        }

        const accessControlConditions = [
          {
            contractAddress: tokenAddress,
            standardContractType,
            chain,
            method: 'balanceOf',
            parameters: [
              ':userAddress'
            ],
            returnValueTest: {
              comparator: '>',
              value: '0'
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