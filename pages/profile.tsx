import { Box, Text, Flex ,Button, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
// import { authUser } from '../utils/cloudFunctions'
import axios from 'axios';
import { useAuth } from '../context/auth';
import { useWeb3React } from "@web3-react/core";

const Profile = () => {
    const { signIn } = useAuth();
    const web3React = useWeb3React();

    const handleConnect = async () => {
        console.log('connect');
        signIn(web3React.account);
    }
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