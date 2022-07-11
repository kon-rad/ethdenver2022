import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useContract, useContractReads, useAccount, useProvider, useContractRead } from 'wagmi'
import { Button, Input, Flex, Box, Text, useMediaQuery } from "@chakra-ui/react";
import Hero from "../components/hero";
import GovernorDashboard from '../components/governorDashboard';
import ShopCard from "../components/shopCard";
import ShopFactory from "../artifacts/contracts/ShopFactory.sol/ShopFactory.json";
import { ethers } from "ethers";

const Home: NextPage = () => {
  const { address } = useAccount();
  const shopFactoryContractData = {
    addressOrName: process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
    contractInterface: ShopFactory.abi,
  }
  let shops: any = [], balance: any = 0;

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...shopFactoryContractData,
        functionName: 'fetchAllShops',
      },
      {
        ...shopFactoryContractData,
        functionName: 'getBalance',
      }
    ],
  })
  // let data;
  console.log('data -> ', data);
  if (data) {
    shops = data[0];
    balance = data[1];
  }

  const [isMobile] = useMediaQuery('(max-width: 600px)');

  return (
    <div>
      <Hero />
      <Flex align="center" justify="center" direction="column" className="bluehaze-box">
        <Text fontSize="6xl" color="Background.darkText" className="title" my="4">Stores</Text>
        <Box p={"6"}>
          {address && <GovernorDashboard balance={balance} />}
          <Box>{isLoading && (<Box fontSize="xl" m="4">Loading ...</Box>)}</Box>
          <Box>{isError && (<Box fontSize="xl" m="4" color="red.500">Yikes, there was an Error; try refreshing</Box>)}</Box>
          <Flex align="center" justify="center" direction="column">
            {(shops || []).map((addr: any, i: number) => (
              <ShopCard key={`shop_${i}`} address={addr} />
            ))}
          </Flex>
        </Box>
      </Flex>
    </div>
  );
};

export default Home;
