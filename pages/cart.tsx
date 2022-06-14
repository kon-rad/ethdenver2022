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

import Shop from "../artifacts/contracts/Shop.sol/Shop.json";

const Cart = () => {
  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const web3React = useWeb3React();
  const { cart, cartMetaData, cartShopAddress, setCart, setCartMetaData, affiliate } =
    useAppState();
  const handleCheckout = async () => {

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
      const ethValue = web3.utils.toWei(
        getCartTotal(cart, cartMetaData).toString(),
        "ether"
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(cartShopAddress, Shop.abi, signer);
      const cartItems = cart.map((item: any) => item.itemId);
      const itemQuantities = cart.map((item: any) => item.qty);
      let transaction;
      let affParam = affiliate ? affiliate : '0x0000000000000000000000000000000000000000';

      transaction = await contract.makeTransaction(
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
    <Box>
      <Flex justify="center">
        <Box width={isMobile ? "80%" : "600px"}>
          <Text mb="6" textAlign="center" fontSize="6xl">
            Shopping Cart
          </Text>
          {transactionHash ? (
            <Flex direction="column" justify="center" align="center">
              <Text fontSize="2xl" color={"brand.400"}>
                Transaction Completed!
              </Text>

              <Link
                isExternal
                href={`https://mumbai.polygonscan.com/tx/${transactionHash}`}
                target={"_blank"}
              >
                <Flex align="center">
                  <ExternalLinkIcon mr="3" fontSize="xl" color={"brand.400"} />
                  <Text fontSize="2xl" color={"brand.400"}>
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
                <Button backgroundColor={"brand.600"} onClick={handleCheckout}>
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
