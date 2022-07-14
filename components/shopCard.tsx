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
import axios from "axios";

interface Props {
  address: string;
}

const ShopCard = (props: Props) => {
  const [name, setName] = useState<string | undefined>();
  const [image, setImage] = useState<string | undefined>();
  const [shopId, setShopId] = useState<any>();
  const [description, setDescription] = useState<string | undefined>();
  const [tags, setTags] = useState<string | undefined>();
  const [owner, setOwner] = useState<string | undefined>();
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

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...shopFactoryContractData,
        functionName: 'name',
      },
      {
        ...shopFactoryContractData,
        functionName: 'metadataUrl',
      },
      {
        ...shopFactoryContractData,
        functionName: 'owner',
      },
      {
        ...shopFactoryContractData,
        functionName: 'shopId',
      }
    ],
  })
  useEffect(() => {
    if (!data) return;
    console.log('use effect data ', data);
    const [_name, _metadata, _owner, _shopId] = data;
    setName(_name as any);
    setOwner(_owner as any);
    fetchMetadata(_metadata as any);
    setShopId(_shopId);
  }, [data]);;
  const fetchMetadata = async (_metadata: string) => {
    console.log('_metadata ', _metadata);
    if (!_metadata) return;
    const { data } = await axios.get(_metadata);
    console.log('axios - data ', data);

    setImage(data.image);
    setDescription(data.description);
    setTags(data.tags);
  }
  if (data) {
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
        <Flex direction="column" justify="start">
          <Box p="4">
            <Text fontSize="2xl" color="black.700" className="title">{name}</Text>
          </Box>
          <Box p="4">
            <Text fontSize="sm" color="black.700" className="short-description">{description}</Text>
          </Box>
          <Spacer />
        </Flex>
      </Flex>
    </Box>
  );
};

export default ShopCard;
