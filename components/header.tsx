import { Text, IconButton, Button, Flex, LinkBox, Spacer, Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image'
import logo from '../resources/images/logo.png';
import Wallet from './wallet';
import { AddIcon } from '@chakra-ui/icons'

const Header = () => {
    return (
        <Flex as="header" p={4} alignItems="center">
            <LinkBox cursor="pointer">
                <NextLink href="/" passHref={true}>
                    <Text fontWeight="bold" fontSize="2xl"color="brand.400">deCom</Text>
                </NextLink>
            </LinkBox>
            <Spacer />
            <Box mr={4}>
                <LinkBox>
                    <NextLink href="/create" passHref={true}>
                        <Button bg="gray.700" color="brand.400">create a shop</Button>
                    </NextLink>
                </LinkBox>
            </Box>
            <Box>
                <Wallet/>
            </Box>
        </Flex>
    )
}

export default Header;