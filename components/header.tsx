import { Text, IconButton, Button, Flex, LinkBox, Spacer, Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image'
import logo from '../resources/images/logo.png';
import Wallet from './wallet';
import { AddIcon } from '@chakra-ui/icons'

const Header = () => {
    return (
        <Flex as="header" p={4} alignItems="center" bg="brand.gradienta">
            <LinkBox cursor="pointer">
                <NextLink href="/" passHref={true}>
                    <Text fontWeight="bold" fontSize="2xl" color="brand.darkslategray">dShop</Text>
                </NextLink>
            </LinkBox>
            <Spacer />
            <Box mr={4}>
                <LinkBox>
                    <NextLink href="/mint" passHref={true}>
                        <Button>create a shop</Button>
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