import {
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Flex,
  Box,
  Text,
  Input,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import web3 from "web3";
import { useState } from "react";
import { ethers } from "ethers";
import Shop from "../artifacts/contracts/Shop.sol/Shop.json";
import { useSigner, useProvider, useContract, useAccount, useContractReads } from 'wagmi'

interface Prop {
  data: any;
  shopAddress: any;
  currentAddress: string;
}

const TransactionItem = (props: Prop) => {
  console.log('transaction data: ', props.data);
  const provider = useProvider();
  const { data: signer } = useSigner();
  
  const [reviewStars, setReviewStars] = useState<number>(5);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSubmitReview = async () => {
    const shopContract = new ethers.Contract(
      props.shopAddress,
      Shop.abi,
      signer
    );
    await shopContract.giveReview(reviewStars, props.data.transId.toNumber());
  };
  return (
    <>
      <Flex
        width="100%"
        key={props.data.transId.toNumber()}
        mb={"6"}
        align="space-between"
      >
        <Flex>
          <Text fontSize="xl" mr="4">
            transaction id#: {props.data.transId.toNumber()}
          </Text>
          <Text fontSize="xl" mr="4">
            total: MATIC{" "}
            {web3.utils.fromWei(props.data.total.toString(), "ether")}
          </Text>
          <Text fontSize="xl" mr="4">
            Review:{" "}
            {props.data.isReviewed ? (
              `${props.data.review.toNumber()} stars`
            ) : (
              <Button onClick={onOpen}>Review</Button>
            )}
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
      <Flex direction="column">
            {props.data.itemIds.map((item: any, i: number) => {
              return (
                <Flex direction="row" my={4} justify="between" align="center">
                  <Text mr={4}>Item ID: {item.toNumber()}</Text>
                  <Text mr={4}>Item Quantity: {props.data.itemQty[i].toNumber()}</Text>
                </Flex>
              )
            })}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new catalog item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="0-5 stars"
              value={reviewStars}
              onChange={(e: any) => setReviewStars(e.target.value)}
              mt={4}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmitReview}>
              Submit Review
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransactionItem;
