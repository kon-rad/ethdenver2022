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

interface ItemType {
  name: string;
  description: string;
  image: string;
  price: any;
  itemId: any;
  inStock: boolean;
}

interface Props {
  data: ItemType;
  shopAddress: string;
  isOwner: boolean;
}

const CatalogItem = (props: Props) => {
  const [qty, setQty] = useState<number>(1);
  const [fileUrl, setFileUrl] = useState<string>("");
  const web3React = useWeb3React();
  const {
    cart,
    cartMetaData,
    setCart,
    setCartMetaData,
    cartShopAddress,
    setCartShopAddress,
  } = useAppState();
  const { getUser, user }  = useAuth();
  useEffect(() => {
    if (user.length === 0 && web3React.account) {
      getUser(web3React.account);
    }
  }, [web3React.account]);

  const handleAddToCart = () => {
    console.log("props.data.itemId: ", props.data, props.data.itemId);
    
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
        name: props.data.name,
        description: props.data.description,
        image: props.data.image,
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

  return (
    <Box mb="4" borderRadius="12px" border="solid" p={"6"}>
      <Flex>
        <Image
          borderRadius="12px"
          src={props.data.image}
          w={"140px"}
          h={"140px"}
        />
        <Box p={"6"}>
          <Text fontSize="2xl" mb={"2"} fontWeight={"bold"}>
            {props.data.name}
          </Text>
          {props.data.inStock ? (
            <Text color="green.600">In Stock</Text>
          ) : (
            <Text color="red.600">Out of Stock</Text>
          )}
          <Text fontSize="md" mb={"2"} color={"gray.700"} fontWeight={"light"}>
            {props.data.description}
          </Text>
          <Text fontSize="md" mb={"2"}>
            MATIC: {web3.utils.fromWei(props.data.price.toString(), 'ether')}
          </Text>
          {props.data.inStock && (
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
          )}
          {props.isOwner && (
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
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CatalogItem;
