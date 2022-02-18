import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Container, Flex, Box, Text, useMediaQuery } from "@chakra-ui/react";
import Hero from "../components/hero";
import { ethers } from "ethers";
import axios from "axios";
import ShopCard from "../components/shopCard";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";

import { shopFactoryAddress } from "../config";

import ShopFactory from "../artifacts/contracts/ShopFactory.sol/ShopFactory.json";

const Home: NextPage = () => {
  const web3React = useWeb3React();
  const [shops, setShops] = useState<string[]>([]);
  useEffect(() => {
    fetchShops();
  }, [web3React.account, web3React.library]);
  const [isMobile] = useMediaQuery('(max-width: 600px)')

  const fetchShops = async () => {
    const provider = web3React.library;

    if (!provider) {
      toast.error(`You must sign in to metamask!`, {
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
    // console.log('network: ', process.env.NEXT_PUBLIC_NETWORK);
    // const provider = ethers.getDefaultProvider(process.env.NEXT_PUBLIC_NETWORK);
    const factoryContract = new ethers.Contract(
      shopFactoryAddress,
      ShopFactory.abi,
      provider
    );

    const data = await factoryContract.fetchAllShops();
    console.log("data: ", data);
    setShops(data);
  };

  return (
    <div>
      <Hero />
      <Flex align="center" justify="center">
        <Box p={"6"}>
          <Flex align="center" justify="center" direction="column">
            {shops.map((addr: any) => (
              <ShopCard address={addr} />
            ))}
          </Flex>
        </Box>
      </Flex>
    </div>
  );
};

export default Home;
