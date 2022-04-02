// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
const dotenv = require('dotenv');
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
const { isItemOwner, getShopOwnerAddress } = require('./utils');

admin.initializeApp();

// get config vars
dotenv.config();

// access config var
// process.env.TOKEN_SECRET;

const getUser = async (address) => {
  const db = admin.firestore();

  let querySnapshot;
  try {
      querySnapshot = await db.collection('users')
          .where("address", "==", address)
          .get();
  } catch (err) {
      res.status(500).send({error: err });
  }

  if (!querySnapshot.docs[0]) {
      return [];
  }

  return querySnapshot.docs;
};

const createUser = async (address) => {

    try {
        const userRef = db.collection('users').doc();
        const nonce = Math.floor(Math.random() * 10000);

        await userRef.set({
            address,
            nonce,
            createdTime: Date.now()
        });

        return [{ id: userRef.id, success: true, nonce }];
    } catch (err) {
        return [{ error: err }];
    }
}

exports.createFile = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const shopAddress = String(req.query.shopAddress);
        const signature = String(req.query.signature);
        const itemId = String(req.query.itemId);
        const filePath = String(req.query.filePath);
        const ownerAddress = String(req.query.ownerAddress);

        // const ownerAddress = await getShopOwnerAddress(shopAddress);

        // get address from sig
        const msg = `I am the owner of shop with address: ${shopAddress}`;

        const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
        const recoveredAddress = recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });
        if (recoveredAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
            res.status(401).send({ error: "User is not owner of shop"})
        }
        try {
            const fileRef = db.collection('files').doc();
            const nonce = Math.floor(Math.random() * 10000000);
            const createdTime = Date.now();

            await fileRef.set({
                owner: ownerAddress,
                nonce,
                createdTime,
                filePath,
                itemId,
                shopAddress,
                lastAccessed: createdTime
            });
    
            return [{ id: fileRef.id, success: true, nonce }];
        } catch (err) {
            return [{ error: err }];
        }
    })
})
exports.authFileOwner = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        const shopAddress = String(req.query.shopAddress);
        const itemId = String(req.query.itemId);
        const transId = String(req.query.transId);
        const signature = String(req.query.signature);
        
        // 1. get address from signature and trans data
        const msg = `I am the owner of item: ${itemId} from shop: ${shopAddress} transaction id: ${transId}`;

        const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
        const recoveredAddress = recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature,
        });
        const isOwnerOfItem = isItemOwner(recoveredAddress, shopAddress, itemId, transId);
        if (!isOwnerOfItem) {
            res.status(401).send({ error: "User is not owner of item"})
        }
    })
})
// exports.authUser = functions.https.onRequest(async (req, res) => {
//   cors(req, res, async () => {

//     const address = String(req.query.address);
//     const signature = String(req.query.signature);
//     functions.logger.info("authUser called with address: ", address);
//     let user = await getUser(address);
//     if (user.length === 0) {
//         user = await createUser(address);
//     }
//     if (user.error) {
//         res.status(400).send({ error: user.error })
//     }

//     const msg = `I am signing my one-time nonce: ${user.nonce}`;

//     // We now are in possession of msg, publicAddress and signature. We
//     // will use a helper from eth-sig-util to extract the address from the signature
//     const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
//     const recoveredAddress = recoverPersonalSignature({
//         data: msgBufferHex,
//         sig: signature,
//     });

//     // The signature verification is successful if the address found with
//     // sigUtil.recoverPersonalSignature matches the initial publicAddress
//     if (address.toLowerCase() === recoveredAddress.toLowerCase()) {
//         // user authorized
//         jwt.sign(
//             {
//                 payload: {
//                     id: user.id,
//                     publicAddress,
//                 },
//             },
//             config.secret,
//             {
//                 algorithm: config.algorithms[0],
//             },
//             (err, token) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 if (!token) {
//                     return new Error('Empty token');
//                 }
//                 return resolve(token);
//             }
//         )
//     } else {
//         res.status(401).send({
//             error: 'Signature verification failed',
//         });

//         return null;
//     }
//     res.status(200).send(user);
//   });
// });
