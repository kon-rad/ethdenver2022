import { useState } from "react";
import { Box, Flex, Text, Button, Link, useMediaQuery } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useAppState } from "../context/appState";
import CartItem from "../components/cartItem";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { getCartTotal } from "../utils/cart";
import web3 from "web3";
import { BigNumber } from 'bignumber.js';
import { useContract, useContractEvent, useSigner, useContractReads, useAccount, useProvider, useContractRead } from 'wagmi'

import Shop from "../artifacts/contracts/Shop.sol/Shop.json";

const Cart = () => {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const { cart, cartMetaData, cartShopAddress, setCart, setCartMetaData, affiliate } = useAppState();
  console.log('cartShopAddress -> ', cartShopAddress);

  const handleCheckout = async () => {
    try {
      const ethValue = web3.utils.toWei(
        getCartTotal(cart, cartMetaData).toString(),
        "ether"
      );
      const cartItems = cart.map((item: any) => item.itemId);
      const itemQuantities = cart.map((item: any) => item.qty);
      let transaction;
      let affParam = affiliate ? affiliate : '0x0000000000000000000000000000000000000000';

      console.log(' transaction -> ', 
        cartItems,
        itemQuantities,
        affParam,
        {
          value: ethValue,
        }
      )
      if (!cartShopAddress) {
        return;
      }
      const shopContract = new ethers.Contract(
        cartShopAddress as any,
        Shop.abi,
        signer
      );
      transaction = await shopContract.makeTransaction(
        cartItems,
        itemQuantities,
        affParam,
        {
          value: ethValue,
        }
      );

      const transData = await transaction.wait();
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
      setTransactionHash(transData.transactionHash);
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
    <Box className="bluehaze-box">
      <Flex justify="center">
        <Box width={isMobile ? "80%" : "600px"}>
          <Text mb="6" textAlign="center" fontSize="6xl" className="title">
            Shopping Cart
          </Text>
          {transactionHash ? (
            <Flex direction="column" justify="center" align="center">
              <Text fontSize="2xl" _hover={{ color: 'brand.lowKeyKool' }}  color={"brand.lowKeyKool"}>
                Transaction Completed!
              </Text>

              <Link
                isExternal
                href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
                target={"_blank"}
              >
                <Flex align="center">
                  <ExternalLinkIcon mr="3" fontSize="xl" _hover={{ color: 'brand.lowKeyKoolHover' }}  color={"brand.lowKeyKool"} />
                  <Text fontSize="2xl" _hover={{ color: 'brand.lowKeyKoolHover' }}  color={"brand.lowKeyKool"}>
                    View transaction on Etherscan
                  </Text>
                </Flex>
              </Link>
            </Flex>
          ) : (
            <Box>
              <Flex direction="column">
                {cart.map((item: any, i: number) => (
                  <CartItem data={item} key={`cartItem_${i}`} />
                ))}
              </Flex>
              <Text m={"2"} fontSize="2xl">
                Total MATIC: {getCartTotal(cart, cartMetaData).toString()}
              </Text>
              <Flex mt="8" justify="center">
                <Button backgroundColor={"brand.seduce"} _hover={{ bg: 'brand.seduceHover' }} onClick={handleCheckout}>
                  Check Out
                </Button>
              </Flex>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Cart;
