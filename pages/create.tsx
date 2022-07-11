import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Box, Flex, Image, Text, Input, Button, useMediaQuery, Textarea } from "@chakra-ui/react";
import ShopFactory from "../artifacts/contracts/ShopFactory.sol/ShopFactory.json";
import { handleIPFSUpload, handleIPFSUploadJSON } from "../utils/ipfs";
import { toast } from "react-toastify";
import Router from "next/router";
import { useWeb3React } from "@web3-react/core";
import { useSigner, useContract, useAccount } from 'wagmi'

const Create = () => {
  const [isMobile] = useMediaQuery('(max-width: 600px)')
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [fileUrl, setImageIPFSHash] = useState<string>("");
  const [longDescription, setLongDescription] = useState<string>("");
  const { data: signer } = useSigner();

  console.log('process.env.NEXT_PUBLIC_FACTORY_ADDRESS - ', process.env.NEXT_PUBLIC_FACTORY_ADDRESS, signer, ShopFactory.abi);
  
  const factoryContract = useContract({
    addressOrName: process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
    contractInterface: ShopFactory.abi,
    signerOrProvider: signer,
  });

  const handleSubmit = async () => {
    // try {
      const shopMetadata = {
        image: fileUrl,
        tags,
        description,
        longDescription
      }
      const shopURL = await handleIPFSUploadJSON(shopMetadata)


      console.log('factoryContract -', factoryContract, 
      name,
      shopURL);
      


      const transaction = await factoryContract.createShop(
        name,
        shopURL
      );
      await transaction.wait();
    // } catch (e: any) {
    //     toast.error(`Error: ${JSON.stringify(e.message)}`, {
    //       position: "top-right",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //   });
    //   return;
    // }
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
    setImageIPFSHash(await handleIPFSUpload(e));
  };
  const validateAndSetTags = (val: string) => {
    let valArr = val.split(', ');
    if (valArr.length > 10) {
      valArr = valArr.slice(0, 10);
    }
    setTags(valArr.join(', '))
  }
  return (
    <Box>
      <Flex align="center" direction="column">
        <Box
          maxWidth={isMobile ? '100%' : "700px"}
          boxShadow='xl'
          backgroundColor="white"
          borderRadius="12px"
          borderColor="Background.400"
          p="12"
        >
        <Box p="8">
          <Text color="brand.darkText" fontSize="6xl" className="title" textAlign="center">
            create a store
          </Text>
        </Box>
          <Flex justify="center" height="200px" mb="4">
            <Box
              borderRadius="12px"
              boxShadow='xl'
              width="204px"
              height="204px"
              mb="6"
            >
              <Image src={fileUrl ? fileUrl : '/images/placeholder-image.png'} width="200px" height="200px" borderRadius="12px"/>
            </Box>
          </Flex>
          <Box mb="4" mt="4">
            <input
              type="file"
              name="Asset"
              className="mr-2"
              onChange={handleImageSelect}
            />
          <Text fontSize="xs" mb="4">image to represent your store</Text>
          </Box>
          <Input
            mb="1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            name={"name"}
            placeholder={"name"}
          />
          <Text fontSize="xs" mb="2">The name of your store and NFT contract, it is not editable.</Text>

           {/* <Text fontSize="xs" mb="2">All caps, no spaces, 10 max character length</Text>  */}
          <Input
            mb="1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              validateAndSetTags(e.target.value)
            }
            value={tags}
            name={"tags"}
            placeholder={"tags"}
          />
          <Text fontSize="xs" mb="2">Tags describe your store for easy searching and navigation by customers. They are seperated by (', ') comma and a space. Max number of tags is 10.</Text>
          <Textarea
            mb="1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDescription((e.target.value))
            }
            value={description}
            name={"description"}
            placeholder={"description"}
          /> 
          <Textarea
            mb="1"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setLongDescription((e.target.value))
            }
            value={longDescription}
            name={"long_description"}
            placeholder={"long description"}
            height="400px"
            mt="2"
          /> 
          <Flex justify={"center"} m="4">
            <Box p="12">
              <Button bg="brand.independence" _hover={{ bg: "brand.independenceHover" }} onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Create;
