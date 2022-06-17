import { useState } from 'react';
import { Box, Text, Flex ,Button, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import axios from 'axios';
import { useAuth } from '../context/auth';
import { useWeb3React } from "@web3-react/core";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    getFirestore,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";

const db = getFirestore();

const Profile = () => {
    const [links, setLinks] = useState<any>([]);
    const { signIn } = useAuth();
    const web3React = useWeb3React();

    const handleConnect = async () => {
        console.log('connect', web3React.account);
        signIn(web3React.account);
    }

    // ====================== Save to Firebase

    const getUserLinks = async () => {
        if (!web3React.account) return;
        const filesRef = collection(db, "files");

        const q = query(filesRef, where("userAddress", "==", web3React.account));

        const querySnapshot = await getDocs(q);

        const currLinks: any = [];
        querySnapshot.forEach((doc) => {
        currLinks.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        setLinks(currLinks);
    };
    return (
        <Box>
            <Flex justify="center">
                <Box maxWidth="1200px" my="6">
                    <Text textAlign="center" fontSize="2xl" fontWeight="bold">Profile</Text>
                    <Tabs>
                        <TabList>
                            <Tab>My Uploads</Tab>
                        </TabList>
                        <Button onClick={handleConnect}>connect</Button>
                        <TabPanels>
                            <TabPanel>
                                <Text textAlign="center" fontWeight="2xl">My Uploads</Text>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Flex>
        </Box>
    )
}

export default Profile