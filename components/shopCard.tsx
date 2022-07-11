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
import { useRouter } from 'next/router'
import Shop from "../artifacts/contracts/Shop.sol/Shop.json";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { useSigner, useContract, useAccount, useContractReads } from 'wagmi'

interface Props {
  address: string;
}

const ShopCard = (props: Props) => {
  const { data: signer } = useSigner();
  const { address, isConnecting, isDisconnected } = useAccount()
  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const router = useRouter();

  const shopContract = useContract({
    addressOrName: props.address,
    contractInterface: Shop.abi,
    signerOrProvider: signer,
  });

  const shopFactoryContractData = {
    addressOrName: props.address,
    contractInterface: Shop.abi,
  }
  let name: any = [];
  let image: any = 0;
  let owner: any = 0;

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...shopFactoryContractData,
        functionName: 'name',
      },
      {
        ...shopFactoryContractData,
        functionName: 'image',
      },
      {
        ...shopFactoryContractData,
        functionName: 'owner',
      }
    ],
  })
  console.log('shopCard data ->  (name, image, owner)', data);
  if (data) {
    name = data[0];
    image = data[1];
    owner = data[2];
  }
  const handleCardClick = (e: any) => {
    e.preventDefault();
    router.push(`/${encodeURIComponent(props.address)}`);

  }

  return (
    <Box
      mb="4"
      width={isMobile ? "100%" : "800px"}
      borderRadius="12px"
      p="4"
      boxShadow='xl'
      backgroundColor="white"
      onClick={handleCardClick}
      className="shopCard"
    >
      <Flex padding="20px">
        <Box width="200px" m="2">
          <Image borderRadius="12px" src={image} width="200px" height="200px" />
        </Box>
        <Box p="4">
          <Text fontSize="2xl" color="black.700" className="title">{name}</Text>
        </Box>
        <Spacer />
      </Flex>
    </Box>
  );
};

export default ShopCard;
