import { useState, useEffect } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useAppState } from "../context/appState";
import CartItem from "../components/cartItem";
import Web3Modal from "web3modal";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import Router from "next/router";
import { useWeb3React } from "@web3-react/core";
import { getCartTotal } from '../utils/cart';
import web3 from 'web3';

import Shop from "../artifacts/contracts/Shop.sol/Shop.json";

const Cart = () => {
  const web3React = useWeb3React();
  const { cart, cartMetaData, cartShopAddress, setCart, setCartMetaData } = useAppState();
  const handleCheckout = async () => {
    console.log("checkout ");
    
    const provider = web3React.library;
    if (!provider) {
      toast.error(`You must sign in with Metamask!`, {
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
    try {
      const ethValue = web3.utils.toWei(getCartTotal(cart, cartMetaData).toString(), "ether");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(cartShopAddress, Shop.abi, signer);
      const cartItems = cart.map((item: any) => item.itemId);
      const itemQuantities = cart.map((item: any) => item.qty);
      const transaction = await contract.makeTransaction(
        cartItems,
        itemQuantities,
        {
            value: ethValue,
        }
      );

      const transId = await transaction.wait();
      toast(`You successfully completed the transaction!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setCart([]);
      setCartMetaData({});
      console.log("transId: ", transId);
    //   Router.push(`/${encodeURIComponent(
    //       cartShopAddress
    //     )}/transaction/${encodeURIComponent(transId.toNumber())}`);
    } catch (e) {
      toast.error(`Error: ${e.message}`, {
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
  };
  return (
    <Box>
      <Flex justify="center">
        <Box width="600px">
          <Text mb="6" textAlign="center" fontSize="6xl">
            Shopping Cart
          </Text>
          <Flex direction="column">
            {cart.map((item: any) => (
              <CartItem data={item} />
            ))}
          </Flex>
          <Text fontSize="2xl">Total MATIC: {getCartTotal(cart, cartMetaData).toString()}</Text>
          <Flex mt="8" justify="center">
            <Button backgroundColor={"brand.600"} onClick={handleCheckout}>
              Check Out
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Cart;
