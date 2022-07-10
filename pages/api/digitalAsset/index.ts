import { createFile } from '../../../utils/cloudFunctions';
import axios from 'axios';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

export default async function handler(req, res) {
    console.log('digital asset api ---- ')
  const apiRes = await axios({
    method: 'get',
    url: 'https://ipfs.io/ipfs/bafybeid7cb2nmq6k26lvyqcwpemm4cvpikph3z2nfrw3srspzteexyasbe',
    responseType: 'stream'
  });
  console.log('apiRes -> ', apiRes);
  

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=vravatar.zip');
  await pipeline(apiRes, res);
  // res.status(200).json(apiRes);
}

 