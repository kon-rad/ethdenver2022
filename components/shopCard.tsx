import { Box, Text, Flex, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Shop from "../artifacts/contracts/Shop.sol/Shop.json";
import { ethers } from "ethers";
interface Props {
  address: string;
}
const ShopCard = (props: Props) => {
  const [owner, setOwner] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [image, setImage] = useState<string>("");
  useEffect(() => {
    getShopData();
  }, []);

  const getShopData = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
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
      <Link href={`/${encodeURIComponent(props.address)}`}>Go to Shop</Link>

      <Flex>
        <Box width="200px" m="2">
          <Image src={image} width="200px" height="200px" />
        </Box>
        <Box>
          <Text fontSize="2xl" color="black.700">
            {name}
          </Text>
          <Text color="gray.600">{desc}</Text>
          owner: {owner}
        </Box>
      </Flex>
    </Box>
  );
};

export default ShopCard;
