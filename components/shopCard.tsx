import { Box, Text, Flex, Image, Spacer } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Shop from "../artifacts/contracts/Shop.sol/Shop.json";
import { ethers } from "ethers";
import { useWeb3React } from '@web3-react/core'
interface Props {
  address: string;
}
const ShopCard = (props: Props) => {
  const web3React = useWeb3React();
  const [owner, setOwner] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [image, setImage] = useState<string>("");
  useEffect(() => {
    getShopData();
  }, []);

  const getShopData = async () => {
    const provider = web3React.library;
    const shopContract = new ethers.Contract(props.address, Shop.abi, provider);
    setName(await shopContract.name());
    setDesc(await shopContract.description());
    setImage(await shopContract.image());
    setOwner(await shopContract.owner());
  };
  return (
    <Box
      mb="4"
      width="600px"
      border="solid"
      borderRadius="6px"
      p="4"
      borderColor="brand.400"
    >
      <Flex>
        <Box width="200px" m="2">
          <Image borderRadius="12px" src={image} width="200px" height="200px" />
        </Box>
        <Box>
          <Text fontSize="2xl" color="black.700">
            {name}
          </Text>
          <Text color="gray.600">{desc}</Text>
        </Box>
          <Spacer/>
          <Link href={`/${encodeURIComponent(props.address)}`}>Go to Shop</Link>
      </Flex>
    </Box>
  );
};

export default ShopCard;
