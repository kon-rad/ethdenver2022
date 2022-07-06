import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { Box, Flex, Image, Text, Input, Button, useMediaQuery } from "@chakra-ui/react";
import ShopFactory from "../artifacts/contracts/ShopFactory.sol/ShopFactory.json";
import { handleImageUpload } from "../utils/ipfs";
import { toast } from "react-toastify";
import Router from "next/router";
import web3 from 'web3';

const Create = () => {
  const [isMobile] = useMediaQuery('(max-width: 600px)')
  const [symbol, setSymbol] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");
  const handleSubmit = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
      ShopFactory.abi,
      signer
    );
    try {
      // const sendValue = web3.utils.toWei('10', 'ether');
      const transaction = await contract.createShop(
        name,
        fileUrl,
        symbol
      );
      await transaction.wait();
    } catch (e: any) {
        toast.error(`Error: ${JSON.stringify(e.message)}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
      return;
    }
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
  const handleImageSelect = async (e: any) => {
    setFileUrl(await handleImageUpload(e));
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
          maxWidth={isMobile ? '100%' : "800px"}
          border="solid"
          borderRadius="8px"
          borderColor="Background.400"
          p="12"
        >
          <Flex justify="center" height="200px" mb="4">
            <Box
              borderRadius="12px"
              border="solid"
              borderColor="brand.400"
              width="204px"
              height="204px"
              mb="4"
            >
              <Image src={fileUrl ? fileUrl : '/images/placeholder-image.png'} width="200px" height="200px" borderRadius="12px"/>
            </Box>
          </Flex>
          <Box mb="4" mt="2">
            <input
              type="file"
              name="Asset"
              className="mr-2"
              onChange={handleImageSelect}
            />
          </Box>
          <Input
            mb="1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            name={"name"}
            placeholder={"shop name"}
          />
          <Text fontSize="xs" mb="2">The name of your shop and NFT contract</Text>
          <Input
            mb="1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSymbol((e.target.value || "").toUpperCase().replace(" ", "").slice(0, 10))
            }
            width="180px"
            value={symbol}
            name={"symbol"}
            placeholder={"shop symbol"}
          />
          <Text fontSize="xs" mb="2">All caps, no spaces, 10 max character length</Text>
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
