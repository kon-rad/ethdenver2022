import React, { useContext, useEffect, useState } from "react";
import app from "../utils/firebase";
import Web3 from "web3";
import {
  doc,
  getDocs,
  getFirestore,
  addDoc,
  collection,
  where,
  query,
} from "firebase/firestore";
import axios from 'axios';
import { initializeApp, getApp, getApps } from "firebase/app";

// export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// const auth = getAuth();

const AuthContext = React.createContext(undefined);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

let web3: Web3 | undefined = undefined; // Will hold the web3 instance

export function AuthProvider({ children }: any) {
  const [currentUser, setCurrentUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>([]);
  useEffect(() => {
    web3 = new Web3((window as any).ethereum);
  }, []);

  const signIn = async (userAddress: string) => {
    console.log("signIn -- ");

    const users: any = await getUser(userAddress);
    if (users.length === 0) {
      users.push(await createUser(userAddress));
    }
    const { address, nonce } = users[0];
    const message = `I am signing my one-time nonce: ${nonce}`;
    const publicAddress = userAddress;
    let signature = '';
    console.log(`inside auth userAddress: ${userAddress} address: ${address} msg: ${message} web3 : ${web3!.eth.personal}`);
    
    try {
        signature = await web3!.eth.personal.sign(
            message,
            address,
            '' // MetaMask will ignore the password argument here
        );

    } catch (err) {
        throw new Error(
            'You need to sign the message to be able to log in.'
        );
    }
    console.log("calling signIn with address: ", userAddress)
    // const result = await axios.get('/api/auth', { params: { sig: signature, publicAddress }});
    const result = await axios.get('http://localhost:5001/decom-eba2a/us-central1/authUser', { params: { address: userAddress }});
    console.log("result: ", result);
  };

  const createUser = async (userAddress: string) => {
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

  const getUser = async (userAddress: string) => {
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
      return users[0];
    }
    setUser(users[0]);
    return users[0];
  };

  useEffect(() => {
    // getUser("asdfasfd");
  }, []);

  const value = {
    currentUser,
    isLoggedIn,
    loading,
    signIn,
    getUser,
    user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): any {
  return useContext(AuthContext);
}
