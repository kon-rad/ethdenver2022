// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
const dotenv = require('dotenv');
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
// const { isItemOwner, getShopOwnerAddress } = require('./utils');
const { recoverPersonalSignature } = require('eth-sig-util')

admin.initializeApp();

// get config vars
dotenv.config();

// access config var
// process.env.TOKEN_SECRET;

const getUser = async (address) => {
  const db = admin.firestore();

  let querySnapshot;
  const users = [];
  try {
        querySnapshot = await db.collection('users')
            .where("address", "==", address)
            .get();

        querySnapshot.forEach((doc) => {
        users.push(doc.data());
        });
  } catch (err) {
      res.status(500).send({error: err });
  }

  return users;
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
        functions.logger.info("authUser called with req.body: ", req.body);
        const shopAddress = String(req.body.data.shopAddress);
        const signature = String(req.body.data.signature);
        const itemId = String(req.body.data.itemId);
        const filePath = String(req.body.data.filePath);
        const ownerAddress = String(req.body.data.ownerAddress);

        const users = await getUser(ownerAddress);

        if (users.length === 0) {
            res.status(500).send({error: `User with address ${ownerAddress} is not found.` });
        }

        const user = users[0];
        functions.logger.info("user found : ", user);

        // const ownerAddress = await getShopOwnerAddress(shopAddress);

        // get nonce from user ownerAddress

        // get address from sig
        const msg = `I am the owner of shop address ${shopAddress} with user nonce: ${user.nonce}`

        const recoveredAddress = recoverPersonalSignature({
            data: msg,
            sig: signature,
        });
        functions.logger.info("creating file insert with recoveredAddress: ", recoveredAddress);

        if (recoveredAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
            res.status(401).send({ error: "User is not owner of shop"})
        }
        try {


            const nonce = Math.floor(Math.random() * 10000000);
            const createdTime = Date.now();
            functions.logger.info("creating file insert with nonce: ", nonce, filePath);

            const data = {
                owner: ownerAddress,
                nonce,
                createdTime,
                filePath,
                itemId,
                shopAddress,
                lastAccessed: createdTime
            };
            const fielsRef = db.ref('files');
            fielsRef.set(data, (error) => {
                if (error) {
                    functions.logger.info('Data could not be saved.', JSON.stringify(error));
                    res.status(500).send({ error: JSON.stringify(error) });
                } else {
                    functions.logger.info('Data succesfully saved.');
                    res.status(200).send({ success: true, nonce });
                }
              });

        } catch (error) {
            res.status(500).send({ error: JSON.stringify(error) });
        }
    })
})
// exports.authFileOwner = functions.https.onRequest(async (req, res) => {
//     cors(req, res, async () => {
//         const shopAddress = String(req.query.shopAddress);
//         const itemId = String(req.query.itemId);
//         const transId = String(req.query.transId);
//         const signature = String(req.query.signature);
        
//         // 1. get address from signature and trans data
//         const msg = `I am the owner of item: ${itemId} from shop: ${shopAddress} transaction id: ${transId}`;

//         const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
//         const recoveredAddress = recoverPersonalSignature({
//             data: msgBufferHex,
//             sig: signature,
//         });
//         const isOwnerOfItem = isItemOwner(recoveredAddress, shopAddress, itemId, transId);
//         if (!isOwnerOfItem) {
//             res.status(401).send({ error: "User is not owner of item"})
//         }
//     })
// })
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
