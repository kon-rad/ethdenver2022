
import type { NextPage } from "next";
import { useEffect, useState } from 'react';
import { Button, Input, Flex, Box, Text, useMediaQuery } from "@chakra-ui/react";
import { useContract, useContractReads, useAccount, useProvider, useContractRead } from 'wagmi'
import { handleWithdraw, handleDelete, handleSelfDestruct } from '../utils/factory';
import ShopFactory from "../artifacts/contracts/ShopFactory.sol/ShopFactory.json";

interface Props {
    balance: any;
}
const GovernorDashboard: NextPage = (props: Props) => {
    const [isGov, setIsGov] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number | undefined>();
    const { address, isConnecting, isDisconnected } = useAccount();
    const provider = useProvider();
    const shopFactoryContract = useContract({
      addressOrName: process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
      contractInterface: ShopFactory.abi,
      signerOrProvider: provider
    })

    useEffect(() => {
      if (address) {
        setIsGov(address == process.env.NEXT_PUBLIC_GOV_ADDRESS);
      }
    }, [address]);
    
    if (!isGov) {
      return '';
    }
   return (
       <>
        <Flex direction="column">
          <Button m="2" onClick={() => handleWithdraw(shopFactoryContract)}>withdraw balance: {props.balance} </Button>
          <Button m="2" onClick={() => handleSelfDestruct(shopFactoryContract)}>self destruct</Button>
          <Input value={deleteId} onChange={(e: any) => setDeleteId(e.target.value)} />
          <Button m="2" onClick={() => handleDelete(shopFactoryContract, deleteId)}>delete shop</Button>
        </Flex>
      </>
   );
}

export default GovernorDashboard;
