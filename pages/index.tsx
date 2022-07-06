import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Button, Input, Flex, Box, Text, useMediaQuery } from "@chakra-ui/react";
import Hero from "../components/hero";
import ShopCard from "../components/shopCard";
import { useWeb3React } from "@web3-react/core";
import Web3 from 'web3';
import { handleWithdraw, handleDelete, handleSelfDestruct, fetchShops } from '../utils/factory';

const Home: NextPage = () => {
  const web3React = useWeb3React();
  const [shops, setShops] = useState<string[]>([]);
  const [balance, setBalance] = useState<string>("0");
  // should be shop address
  const [deleteId, setDeleteId] = useState<string>("");
  const [isGov, setIsGov] = useState<boolean>(false);

  const web3Provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_NETWORK);
  const web3 = new Web3(web3Provider);

  useEffect(() => {
    fetchShops(web3React, setShops, setBalance);
    setIsGov(process.env.NEXT_PUBLIC_GOV === web3React.account);
    console.log('process.env.NEXT_PUBLIC_GOV', process.env.NEXT_PUBLIC_GOV);
    
  }, [web3React.account, web3React.library]);
  const [isMobile] = useMediaQuery('(max-width: 600px)')

  return (
    <div>
      <Hero />
      <Flex align="center" justify="center">
        <Box p={"6"}>
        {isGov && (
          <Flex direction="column">
            <Button m="2" onClick={() => handleWithdraw(web3React)}>withdraw balance: {balance} </Button>
            <Button m="2" onClick={() => handleSelfDestruct(web3React)}>self destruct</Button>
            <Input value={deleteId} onChange={(e: any) => setDeleteId(e.target.value)} />
            <Button m="2" onClick={() => handleDelete(web3React, deleteId)}>delete shop</Button>
          </Flex>
        )}
          <Flex align="center" justify="center" direction="column">
            {shops.map((addr: any, i: number) => (
              <ShopCard key={`shop_${i}`} address={addr} />
            ))}
          </Flex>
        </Box>
      </Flex>
    </div>
  );
};

export default Home;
