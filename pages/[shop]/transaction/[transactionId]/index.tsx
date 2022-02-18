import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface Props {}

const TransactionDetail = (props: Props) => {
  const router = useRouter();
  console.log("router.query" ,router.query);

  return (
    <Flex justify="center" align="center">
      <Box width="600px">
        <Text>Transaction detail for {router.query.shop} </Text>
        <Text>Transaction detail for {router.query.transactionId} </Text>
      </Box>
    </Flex>
  );
};

export default TransactionDetail;
