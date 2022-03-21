import { Box, Text, Flex, Image, Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useAppState } from "../context/appState";
import web3 from 'web3';
import { BigNumber } from 'bignumber.js';

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
}

const CatalogItem = (props: Props) => {
  const [qty, setQty] = useState<number>(1);
  const {
    cart,
    cartMetaData,
    setCart,
    setCartMetaData,
    cartShopAddress,
    setCartShopAddress,
  } = useAppState();
  console.log("cart: ", cart);
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
        name: props.data.name,
        description: props.data.description,
        image: props.data.image,
        price: new BigNumber(web3.utils.fromWei(props.data.price.toString(), 'ether')),
      },
    });
  };

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
        </Box>
      </Flex>
    </Box>
  );
};

export default CatalogItem;
