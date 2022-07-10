import LitJsSdk from 'lit-js-sdk'
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { publishFileToNFTStorage } from './ipfs';
import streamToBlob from 'stream-to-blob';
 


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

        const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file: file })
        // const { encryptedString, symmetricKey } = await LitJsSdk.encryptString('hello world LIT!!!!')
        console.log('--- file encrypted encryptFile - symmetricKey: ', symmetricKey);

        const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
            accessControlConditions,
            symmetricKey,
            authSig,
            chain,
        })

        console.log('--- key encrypted saveEncryptionKey: ', encryptedSymmetricKey);

        const url = await publishFileToNFTStorage(encryptedFile);
        // const encryptedFileURL = `${added.path}`;
        // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        // const encryptedFileURL = encryptedString;
        // console.log('--- encryptedFile added to ipfs: ', encryptedString);

        return {
            encryptedFileURL: (url),
            encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
        }
    }
    async decrypt(encryptedFile: any, encryptedSymmetricKey: string, tokenAddress: any, authSig: any) {
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

        // const res = await axios.get(encryptedFile, {
        //   responseType: 'blob',
        //   onDownloadProgress: (progressEvent) => {
        //     let percentCompleted = Math.round(
        //       (progressEvent.loaded * 100) / progressEvent.total
        //     );
        //     console.log('progress -> ', percentCompleted, progressEvent);
        //   },
        // });

        const res = await axios({
          url: encryptedFile,
          method: 'GET',
          responseType: 'blob', // important
      })
      // const downloadStream = await axios.get(encryptedFile, {
      //   maxContentLength: Infinity, 
      //   responseType: 'stream', 
      // }) 
      console.log('res -> ', res)
      // const blob = await streamToBlob(res)
      
      // var file = new File([res as any], "myavatar.jpg");
      // console.log('encryptedSymmetricKey -> ', encryptedSymmetricKey);
      // console.log('file -> ', file);
      // console.log('res -> ', res);
      // console.log('blob -> ', blob);
      
      // const res = await fetch(encryptedFile);
      // const b = await res.blob();

      // let url = window.URL.createObjectURL(b);
      // let a = document.createElement('a');
      // a.href = url;
      // a.download = 'employees.json';
      // a.click();
          //window.location.href = response.url;
        // const res = await axios({
        //   method: 'get',
        //   url: encryptedFile,
        //   responseType: 'stream'
        // });
            // res.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
        
        // const decryptedFile = 'something';
        // const res = await axios.get('/api/digitalAsset');
        // console.log('api res - ', res);

        const symmetricKey = await this.litNodeClient.getEncryptionKey({
          accessControlConditions,
          toDecrypt: encryptedSymmetricKey,
          chain,
          authSig
        });
        console.log("symmetricKey - ", symmetricKey, LitJsSdk.uint8arrayToString(symmetricKey, "base16"));
        
    
        const decryptedFile = await LitJsSdk.decryptFile({
          file: res.data,
          symmetricKey: symmetricKey
        });
    
      return { decryptedFile }
    }
}

export default new Lit()