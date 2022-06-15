import { url } from "inspector";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { encrypt } from '../services/encryption';

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export async function handleImageUpload(e: any) {
  if (!e || !e.target || !e.target.files || !e.target.files[0]) {
    return;
  }
  const file = e.target.files[0];
  try {
    // nft.storage was returning 500 type error - it was reported on discord that it was down
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    return url;
  } catch (error) {
    console.log(`Error uploading file: ${error}`);
  }
}

export const encryptFile = (e: any, setEncryptedUrl: any) => {
  if (!e || !e.target || !e.target.files || !e.target.files[0]) {
    return;
  }
  const file = e.target.files[0];
  const fileReader = new FileReader(); // initialize the object  
  fileReader.readAsArrayBuffer(file);
  let data;
  // console.log("file: ", file);
  
  // const fileBuffer = Buffer.from(file, 'base64')
  // console.log('fileBuffer buffer: ', fileBuffer);
  // return fileBuffer;

  fileReader.onload = async (event) => {
    // const content = event.target.result;
    // data = Buffer.from(fileReader.result.toString());
    console.log('fileReader.result buffer: ', fileReader.result.toString());
    data = encrypt(fileReader.result);
    console.log('encrypted data: ', data);
    try {
      const added = await client.add(data, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setEncryptedUrl(url);
    } catch (error) {
      console.log(`Error uploading file: ${error}`);
    }
  }
}

// function for uploading a file to IPFS
export async function uploadFile(e: any): Promise<string> {
  if (!e || !e.target || !e.target.files || !e.target.files[0]) {
    return;
  }
  const file = e.target.files[0];
  try {
    const added = await client.add(file, {
      progress: (prog) => console.log(`received: ${prog}`),
    });
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    return url;
  } catch (error) {
    console.log(`Error uploading file: ${error}`);
  }
}
