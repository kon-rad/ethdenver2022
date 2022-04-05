import { createFile } from '../../../utils/cloudFunctions';

export default async function handler(req, res) {
    console.log('req: ', req.query);
    const { shopAddress, signature, itemId, filePath, ownerAddress } = req.query;
    
    console.log("shopAddress, signature, itemId, filePath, ownerAddress: ", shopAddress, signature, itemId, filePath, ownerAddress);
    
    const result = await createFile({ shopAddress, signature, itemId, filePath, ownerAddress });
    
    res.status(200).json({ data: result });
  }

