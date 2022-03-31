// const Web3 = require("web3");
const { initializeApp } = require("firebase-admin/app");
const {
  getDocs,
  getFirestore,
  addDoc,
  collection,
  where,
  query,
} = require("firebase/firestore");

const app = initializeApp();

// const db = getFirestore(app);
const db = () => getFirestore(app);

exports.createUser = async (userAddress) => {
  const nonce = Math.floor(Math.random() * 10000);
  try {
    const docRef = await addDoc(collection(db, "users"), {
      address: userAddress,
      nonce,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  return [{ address: userAddress, nonce }];
};

const getUser = async (userAddress) => {
  const userRef = collection(db, "users");
  const q = query(userRef, where("address", "==", userAddress));

  const querySnapshot = await getDocs(q);
  const users = [];
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    users.push(doc.data());
  });
  if (users.length === 0) {
    users.push(await createUser(userAddress));
  }
  return users[0];
};
