import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Input, Flex, Box, Text, useMediaQuery } from "@chakra-ui/react";
import Hero from "../components/hero";
import { ethers } from "ethers";
import axios from "axios";
import ShopCard from "../components/shopCard";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import web3 from 'web3';
import { shopFactoryAddress } from "../config";

import ShopFactory from "../artifacts/contracts/ShopFactory.sol/ShopFactory.json";

const Home: NextPage = () => {
  const web3React = useWeb3React();
  const [shops, setShops] = useState<string[]>([]);
  const [balance, setBalance] = useState<string>("0");
  // should be shop address
  const [deleteId, setDeleteId] = useState<string>("");
  const [isGov, setIsGov] = useState<boolean>(false);
  useEffect(() => {
    fetchShops();
    setIsGov(process.env.NEXT_PUBLIC_GOV === web3React.account);
    console.log('process.env.NEXT_PUBLIC_GOV', process.env.NEXT_PUBLIC_GOV);
    
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
    const balance = await factoryContract.getBalance();
    console.log("data: ", data);
    setShops(data);
    setBalance(web3.utils.fromWei(balance.toString(), 'ether'));
  };
  const handleWithdraw = async () => {
    const provider = web3React.library;
    const signer = provider.getSigner();

    const factoryContract = new ethers.Contract(
      shopFactoryAddress,
      ShopFactory.abi,
      signer
    );
    await factoryContract.withdraw();
  };
  const handleDelete = async () => {
    const provider = web3React.library;
    const signer = provider.getSigner();

    const factoryContract = new ethers.Contract(
      shopFactoryAddress,
      ShopFactory.abi,
      signer
    );
    await factoryContract.deleteShop(deleteId);
  };
  const handleSelfDestruct = async () => {
    const provider = web3React.library;
    const signer = provider.getSigner();

    const factoryContract = new ethers.Contract(
      shopFactoryAddress,
      ShopFactory.abi,
      signer
    );
    await factoryContract.selfDestruct();
  };

  return (
    <div>
      <Hero />
      <Flex align="center" justify="center">
        <Box p={"6"}>
        {isGov && (
          <Flex direction="column">
            <Button m="2" onClick={handleWithdraw}>withdraw balance: {balance} </Button>
            <Button m="2" onClick={handleSelfDestruct}>self destruct</Button>
            <Input value={deleteId} onChange={(e: any) => setDeleteId(e.target.value)} />
            <Button m="2" onClick={handleDelete}>delete shop</Button>
          </Flex>
        )}
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
