import {
  useMediaQuery,
  Box,
  Flex,
  Image,
  Spacer,
  Text,
  Button,
  Input,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useAppState } from "../context/appState";
import { useState, useEffect } from "react";

interface Props {
  data: any;
}

const CartItem = (props: Props) => {
  const [localQty, setLocalQty] = useState<number | null>(null);
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const { cartMetaData, cart, setCart, setCartMetaData } = useAppState();
  useEffect(() => {
    setLocalQty(props.data.qty);
  }, [props.data.qty]);

  const handleUpdate = () => {
    if (localQty === 0) {
      handleDelete();
      return;
    }
    const id = props.data.itemId;
    const currCart = cart.map((item: any) => {
      console.log("item.itemId === id", item.itemId, id);
      if (item.itemId === id) {
        return {
          ...item,
          qty: Number(localQty),
        };
      }
      return item;
    });
    setCart(currCart);
  };
  const handleDelete = () => {
    const id = props.data.itemId;
    const currMetaData = cartMetaData;

    delete currMetaData[props.data.itemId];
    const currCart = cart.filter((item: any) => item.itemId !== id);
    setCartMetaData(currMetaData);
    setCart(currCart);
  };
  console.log("cartdata: ", cartMetaData, props);

  return (
    <Box key={props.data.itemId} mb="6">
      <Flex align="center" direction={isMobile ? "column" : "row"}>
        <Image
          border="solid"
          borderColor="Background.400"
          borderRadius="12px"
          mr="4"
          w="120px"
          h="120px"
          src={cartMetaData[props.data.itemId].image}
        />
        <Flex direction="column" m="2">
          <Text fontSize="xl" mb="2">
            {cartMetaData[props.data.itemId].name}
          </Text>
          <Text fontSize="sm">
            {cartMetaData[props.data.itemId].description}
          </Text>
        </Flex>
        <Spacer />
        <Text fontSize="md" m={"1"}>
          Qty:
        </Text>
        <Input m={"1"} width="80px" value={localQty} onChange={(e: any) => setLocalQty(e.target.value)} />
        <Button m={"1"} onClick={handleUpdate}>
          update
        </Button>
        <Button m={"1"} onClick={handleDelete} backgroundColor="red.400">
          <CloseIcon />
        </Button>
      </Flex>
    </Box>
  );
};

export default CartItem;
