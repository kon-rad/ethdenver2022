import { Spacer, Flex, Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import web3 from 'web3';

interface Prop {
  data: any;
  shopAddress: string;
}

const TransactionItem = (props: Prop) => {
  const router = useRouter();
  return (
    <Flex
      width="100%"
      key={props.data.transactionId}
      mb={"6"}
      align="space-between"
    >
      <Flex >
        <Text fontSize="xl" mr="4">
          id#: {props.data.transId.toNumber()}
        </Text>
        <Text fontSize="xl" mr="4">
          total: MATIC {web3.utils.fromWei(props.data.total.toString(), 'ether')}
        </Text>
      </Flex>
      <Spacer />
      <Link
        href={`/${encodeURIComponent(
          props.shopAddress
        )}/transaction/${encodeURIComponent(props.data.transId)}`}
      >
        Detail
      </Link>
    </Flex>
  );
};

export default TransactionItem;
