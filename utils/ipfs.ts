import { url } from "inspector";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { encrypt } from '../services/encryption';
import { NFTStorage } from "nft.storage";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0" as any);

export async function handleImageUpload(e: any) {
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

const toBuffer = (ab: any) => {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
  }
  return buffer;
}

export const encryptFile = (e: any, completeFileEncryption: any, secretKey: string) => {
  if (!e || !e.target || !e.target.files || !e.target.files[0]) {
    return;
  }
  const file = e.target.files[0];
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);

  fileReader.onload = async (event) => {
    const data = encrypt(toBuffer(fileReader.result), secretKey);
    try {
      const added = await client.add(data, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      completeFileEncryption(url, secretKey);
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

export async function publishFileToNFTStorage(file: any) {
  const nftStorage = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxREVEZjVCMmI3REU3NDA1RjM4YjkwMjNhYzAxNTdFMTU3MGE1NjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDcyMTAwODQyMiwibmFtZSI6ImFtc3RlcmRhbSJ9.Sn1JCXO3xWD5tLdsCsWVRzbNyJFE1fOSQjTYzaKfEPU",
  });
  
  // let sampleDict = JSON.stringify(file);
  const blob = new Blob([file]);
  console.log("storing blob in nft storage: ", blob);
  const cid = await nftStorage.storeBlob(blob);
  console.log("cid -> ", cid);
  return `https://ipfs.io/ipfs/${cid}`;
}
