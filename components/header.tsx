import {
  Text,
  Image,
  Button,
  Flex,
  LinkBox,
  Spacer,
  Box,
} from "@chakra-ui/react";
import NextLink from "next/link";
import Wallet from "./wallet";
import { AddIcon } from "@chakra-ui/icons";
import { useAppState } from "../context/appState";
import { getCartQty } from '../utils/cart';

const Header = () => {
  const { cart, setCart } = useAppState();

  return (
    <Flex as="header" p={4} alignItems="center">
      <LinkBox cursor="pointer">
        <NextLink href="/" passHref={true}>
          <Flex align="center">
            <Image
              borderRadius="12px"
              mr="4"
              src="/images/logo.png"
              width="40px"
              height="40px"
            />
            <Text fontWeight="bold" fontSize="2xl" color="brand.400">
              deCom
            </Text>
          </Flex>
        </NextLink>
      </LinkBox>
      <Spacer />
      <Box mr={4}>
        <LinkBox>
          <NextLink href="/cart" passHref={true}>
            <Button bg="gray.700" backgroundColor={'brand.400'}>
              <Flex align="center">
                <Text fontSize="md" fontWeight="bold" mr="4" color="black">
                  {getCartQty(cart)}
                </Text>
                <Image
                  src="/images/shopping-cart.png"
                  width="20px"
                  height="20px"
                />
              </Flex>
            </Button>
          </NextLink>
        </LinkBox>
      </Box>
      <Box mr={4}>
        <LinkBox>
          <NextLink href="/create" passHref={true}>
            <Button bg="gray.700" color="brand.400">
              <AddIcon mr="4" />
              create a shop
            </Button>
          </NextLink>
        </LinkBox>
      </Box>
      <Box>
        <Wallet />
      </Box>
    </Flex>
  );
};

export default Header;
