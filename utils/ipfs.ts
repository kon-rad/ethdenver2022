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
