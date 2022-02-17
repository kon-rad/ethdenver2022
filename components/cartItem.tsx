import { Box, Flex, Image, Spacer, Text, Button, Input } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useAppState } from "../context/appState";

interface Props {
  data: any;
}

const CartItem = (props: Props) => {
  const { cartMetaData } = useAppState();

  return (
    <Box key={props.data.itemId} mb="6">
      <Flex align="center">
          <Image border="solid" borderColor="Background.400" borderRadius="12px" mr="4" w="120px" h="120px" src={cartMetaData[props.data.itemId].image} />
        <Flex direction="column" mr="6">
          <Text fontSize="xl" mb="2">
            {cartMetaData[props.data.itemId].name}
          </Text>
          <Text fontSize="sm">
            {cartMetaData[props.data.itemId].description}
          </Text>
        </Flex>
        <Spacer />
        <Text fontSize="md" mr="4">
          Qty:
        </Text>
        <Input width="80px" mr="4" value={props.data.qty} />
        <Button mr="4">update</Button>
        <Button backgroundColor="red.400">
          <CloseIcon />
        </Button>
      </Flex>
    </Box>
  );
};

export default CartItem;
