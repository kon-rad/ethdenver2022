import { createFile } from '../../../utils/cloudFunctions';

export default async function handler(req, res) {
    console.log('req: ', req.query);
    const { shopAddress, nftAddress, signature, itemId, fileUrl, ownerAddress } = req.query;
    
    console.log("shopAddress, signature, itemId, filePath, ownerAddress: ", shopAddress, signature, itemId, filePath, ownerAddress);
    
    const result = await createFile({ shopAddress, signature, itemId, fileUrl, ownerAddress });
    
    console.log('result on createFile API: ', result);
    res.status(200).json(result);
  }

 