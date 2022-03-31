import { authUser } from '../../../utils/cloudFunctions';

export default async function handler(req, res) {
    console.log('req: ', req.query);
    const { sig, publicAddress } = req.query;
    
    const result = await authUser({ sig, publicAddress });
    res.status(200).json({ msg: result });
  }