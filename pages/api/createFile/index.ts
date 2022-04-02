import { createFile } from '../../../utils/cloudFunctions';

export default async function handler(req, res) {
    console.log('req: ', req.query);
    const { shopAddress, signature, itemId, filePath, ownerAddress } = req.query;
    
    const result = await createFile({ shopAddress, signature, itemId, filePath, ownerAddress });
    
    res.status(200).json({ msg: result });
  }

