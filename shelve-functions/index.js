import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

const getUser = async (userAddress) => {
    admin.firestore().collection('usertest').add({userAddress: userAddress});
    // const user = await admin.firestore().collection('usertest').where('address', '==', request.address);

    let users = []
    // admin.firestore().collection('user').doc("user").collection("notes").doc
    await admin.firestore().collection("usertest").where('address', '==', request.address).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
    });


    // const userRef = collection(db, "users");
    // const q = query(userRef, where("address", "==", userAddress));
  
    // const querySnapshot = await getDocs(q);
    // const users = [];
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    //   users.push(doc.data());
    // });
    // if (users.length === 0) {
    //   users.push(await createUser(userAddress));
    // }
    // return users[0];
    return users;
  };

export const authUser = functions.https.onRequest(async (request, response) => {
  functions.logger.info("authUser Hello logs!", request);

  const { sig, publicAddress } = request;
    // const user = await utils.getUser(publicAddress);
    const user = await getUser(publicAddress);
    response.send("Hello from authUser Firebase!", user);
});



module.exports = function (req, res) {
  cors(req, res, async () => {
      await tokenHelper.verifyToken(req, res);

      // Verify that the user provided an income and userID
      if (isUndefined(req.body.income) || !req.body.userID)
          return res.status(422).send({error: translator.t('errorInEntry')});

      const db = admin.firestore();
      const userID = String(req.body.userID);
      const income = parseInt(req.body.income);
      const totalGoalsAmount = parseInt(req.body.totalGoalsAmount);
      const disposable = parseInt(req.body.disposable);

      try {
          const budgetRef = db.collection('budgets').doc();

          await budgetRef.set({
              userID,
              income,
              totalGoalsAmount,
              disposable
          });

          res.status(200).send({id: budgetRef.id, success: true});
      } catch (err) {
          res.status(422).send({error: translator.t('budgetCreationFailed')});
      }
  })
};