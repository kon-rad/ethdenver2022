import type { NextPage } from "next";
import { useEffect, useState } from 'react';
import { Container, Flex, Box, Text } from "@chakra-ui/react";
import Hero from "../components/hero";
import { ethers } from 'ethers';
import axios from 'axios';
import ShopCard from '../components/shopCard';

import { shopFactoryAddress } from '../config';

import ShopFactory from '../artifacts/contracts/ShopFactory.sol/ShopFactory.json';

const Home: NextPage = () => {
  const [shops, setShops] = useState<string[]>([]);
  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider();
    const factoryContract = new ethers.Contract(shopFactoryAddress, ShopFactory.abi, provider);

    const data = await factoryContract.fetchAllShops();
    console.log('data: ', data);
    setShops(data);
  }
  
  return (
    <div>
      <Hero />
      <Flex align="center">
        <Box p={"6"}>
          {shops.map((addr: any) => <ShopCard data={addr} />)}
        </Box>
      </Flex>
    </div>
  );
};

export default Home;
