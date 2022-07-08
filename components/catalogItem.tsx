import { Box, Text, Flex, Image, Button, Input } from "@chakra-ui/react";
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
  const [qty, setQty] = useState<number>(1);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [metadata, setMetadata] = useState<any>();
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

    const tokenUri = await nftContract.tokenURI(props.data.itemId.toNumber());
    console.log('tokenUri - ', tokenUri, ' itemId - ', props.data.itemId.toNumber());
    
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

  const handleAddToCart = () => {
    const id = props.data.itemId.toNumber();

    if (props.shopAddress !== cartShopAddress) {
      setCartShopAddress(props.shopAddress);
    }

    if (cartMetaData.hasOwnProperty(id)) {
      const currCart = cart.map((item: any) => {
        console.log("item.itemId === id", item.itemId, id);
        if (item.itemId === id) {
          return {
            ...item,
            qty: item.qty + Number(qty),
          };
        }
        return item;
      });
      setCart(currCart);
    } else {
      setCart([
        ...cart,
        { qty: Number(qty), itemId: props.data.itemId.toNumber() },
      ]);
    }
    setCartMetaData({
      ...cartMetaData,
      [props.data.itemId.toNumber()]: {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        price: new BigNumber(web3.utils.fromWei(props.data.price.toString(), 'ether')),
      },
    });
  };
  const setNewFile = async (e: any) => {
    const newFileUrl = await uploadFile(e);
    setFileUrl(newFileUrl);
  }
  const handleUploadFile = async () => {
    console.log('user: ', user);
    
    if (!fileUrl || !user.nonce || !props.shopAddress) {
      return;
    }
    const body = `I am the owner of shop address ${props.shopAddress} with user nonce: ${user.nonce}`
    let sig = '';
    try {
      sig = await signMessage({ body })
    } catch (error) {
      toast.error(`Error: ${JSON.stringify(error)}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return
    }

    // todo: get signature of user w/ message of nonce from localstorage in authContext

    const result = await axios.get(
      '/api/createFile',
      { 
        params:
        { 
          shopAddress: props.shopAddress,
          signature: sig,
          itemId: props.data.itemId.toNumber(),
          filePath: fileUrl,
          ownerAddress: web3React.account 
        }
      }
    );
    console.log("result: ", result);
  }
  console.log("data: ", props.data);

  return (
    <Box mb="4" borderRadius="12px" border="solid" borderWidth={1} borderColor={"black.600"} p={"6"} boxShadow="md">
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
            <>
              <Input
                placeholder="Quantity"
                width="80px"
                onChange={(e: any) => setQty(e.target.value)}
                value={qty}
                mr={"4"}
              />
              <Button m={'2'} onClick={handleAddToCart}>Add to Cart</Button>
            </>
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
