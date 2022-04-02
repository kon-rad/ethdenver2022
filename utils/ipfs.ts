import { url } from "inspector";
import { create as ipfsHttpClient } from "ipfs-http-client";

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
