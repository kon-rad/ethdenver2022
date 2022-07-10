import { Box, Text, Link, Flex, Image, Button, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppState } from "../context/appState";
import web3 from 'web3';
import { uploadFile } from '../utils/ipfs';
import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { useWeb3React } from '@web3-react/core';
import { signMessage } from '../utils/eth';
import { toast } from "react-toastify";
import { ethers } from "ethers";
import ItemToken from '../artifacts/contracts/tokens/ItemToken.sol/ItemToken.json';
import { useContract, useContractReads, useAccount, useProvider, useContractRead } from 'wagmi'
import { useRouter } from 'next/router'

interface BigNumberType {
  _isBigNumber: boolean,
  _hex: string,
  toNumber: any
}

interface ItemType {
  itemId: BigNumberType,
  price: BigNumberType,
  isDelete: boolean
}

interface Props {
  data: ItemType;
  shopAddress: any;
  nftAddress: string;
  isOwner: boolean;
}

const CatalogItem = (props: Props) => {
  const [fileUrl, setFileUrl] = useState<string>("");
  const [metadata, setMetadata] = useState<any>();
  const router = useRouter()
  const web3React = useWeb3React();
  const {
    cart,
    cartMetaData,
    catalogItems,
    setCatalogItems,
    setCart,
    setCartMetaData,
    cartShopAddress,
    setCartShopAddress,
  } = useAppState();
  const { address } = useAccount();
  const provider = useProvider();

  const { getUser, user }  = useAuth();
  useEffect(() => {
    if (user.length === 0 && address) {
      getUser(address);
    }
    fetchNFTData();
  }, [address]);

  const fetchNFTData = async () => {
    console.log('fetchNFTData');
    
    const nftContract = new ethers.Contract(props.nftAddress, ItemToken.abi, provider);

    const tokenUri = await nftContract.tokenURI(1);
    console.log('tokenUri - ', tokenUri, ' itemId - ', 1);
    
    // const url = `https://ipfs.infura.io/ipfs/${tokenUri}`;
    const _metadata = await axios.get(tokenUri);

    setMetadata(_metadata.data);
    console.log("_metadata: ", _metadata);
    const currentStoreItems = catalogItems[props.shopAddress] || {};
    setCatalogItems({
      ...catalogItems,
      [props.shopAddress]: {
        ...currentStoreItems,
        [props.data.itemId.toNumber()]: _metadata.data
      }
    })
  }

  const handleItemClick = (e: any) => {
    e.preventDefault();
    router.push(`/nft/${encodeURIComponent(props.nftAddress)}`);
  }
  return (
    <Box mb="4" onClick={handleItemClick} borderRadius="12px"  p={"6"} boxShadow="xl" width="800px" height="260px" className="catalog_item">
      <Flex>
        {
          metadata && (<Image
            borderRadius="12px"
            src={metadata.image}
            w={"140px"}
            h={"140px"}
          />)
        }
        <Box p={"6"}>
          <Text fontSize="2xl" mb={"2"} fontWeight={"bold"} color="black.700">
            {metadata && metadata.name}
          </Text>
          <Text fontSize="md" mb={"2"} color={"gray.700"} fontWeight={"light"}>
            {metadata && metadata.description}
          </Text>
          <Text fontSize="md" mb={"2"} color="black.700">
            MATIC: {web3.utils.fromWei(props.data.price.toString(), 'ether')}
          </Text>
          {/* {props.isOwner && (
            <Box m={"2"}>
              <input
                type="file"
                name="Asset"
                className="mr-2"
                onChange={(e: any) => setNewFile(e)}
              />
              {fileUrl && <Text m={4} fontSize="sm">{fileUrl}</Text>}
              <Text>Upload File for Sale</Text>
              <Button onClick={handleUploadFile} m={4}>Upload File</Button>
            </Box>
          )} */}
        </Box>
      </Flex>
    </Box>
  );
};

export default CatalogItem;
