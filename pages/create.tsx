import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { Box, Flex, Text, Input, Button } from "@chakra-ui/react";
import { shopFactoryAddress } from "../config";
import ShopFactory from "../artifacts/contracts/ShopFactory.sol/ShopFactory.json";
import { handleImageUpload } from '../utils/ipfs';
import { toast } from "react-toastify";
import Router from 'next/router'

const Create = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const handleSubmit = async () => {
    console.log("submit");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      shopFactoryAddress,
      ShopFactory.abi,
      signer
    );
    const transaction = await contract.createShop(
      name,
      description,
      location,
      phone,
      fileUrl
    );
    await transaction.wait();
    toast(`You successfully created ${name}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    Router.push("/");
  };
  return (
    <Box>
      <Flex align="center" direction="column">
        <Box p="8">
          <Text color="brand.400" fontSize="6xl">
            create a shop
          </Text>
        </Box>
        <Box
          maxWidth="600px"
          border="solid"
          borderRadius="8px"
          borderColor="Background.400"
          p="12"
        >
          <Input
            mb="2"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            name={"name"}
            placeholder={"shop name"}
          />
          <Input
            mb="2"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
            name={"description"}
            placeholder={"shop description"}
          />
          <Input
            mb="2"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLocation(e.target.value)
            }
            name={"address"}
            placeholder={"shop address"}
          />
          <Input
            mb="2"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value)
            }
            name={"phoneNumber"}
            placeholder={"shop phone number"}
          />
          <input
            type="file"
            name="Asset"
            className="mr-2"
            onChange={handleImageUpload}
          />
        </Box>
        <Box p="12">
          <Button color="brand.400" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default Create;
