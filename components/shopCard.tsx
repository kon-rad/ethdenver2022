import {
  useMediaQuery,
  Box,
  Text,
  Flex,
  Image,
  Spacer,
  Button
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Shop from "../artifacts/contracts/Shop.sol/Shop.json";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
interface Props {
  address: string;
}
const ShopCard = (props: Props) => {
  const web3React = useWeb3React();
  const [owner, setOwner] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [isMobile] = useMediaQuery("(max-width: 600px)");
  useEffect(() => {
    getShopData();
  }, []);

  const getShopData = async () => {
    const provider = ethers.getDefaultProvider(process.env.NEXT_PUBLIC_NETWORK);
    const shopContract = new ethers.Contract(props.address, Shop.abi, provider);
    setName(await shopContract.name());
    setImage(await shopContract.image());
    setOwner(await shopContract.owner());
  };
  return (
    <Box
      mb="4"
      width={isMobile ? "100%" : "700px"}
      borderRadius="12px"
      p="4"
      boxShadow='xl'
    >
      <Flex>
        <Box width="200px" m="2">
          <Image borderRadius="12px" src={image} width="200px" height="200px" />
        </Box>
        <Box>
          <Text fontSize="2xl" color="black.700">
            {name}
          </Text>
        </Box>
        <Spacer />
        <Link href={`/${encodeURIComponent(props.address)}`}>
            <Button backgroundColor="brand.400" color="gray.900">
                Go</Button></Link>
      </Flex>
    </Box>
  );
};

export default ShopCard;
