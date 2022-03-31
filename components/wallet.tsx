import { useWeb3React } from '@web3-react/core';
import { Button, Box, Flex, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { injected, formatAddress } from '../utils/web3'
import { UserRejectedRequestError } from '@web3-react/injected-connector'
import { DEFAULT_COLOR_SCHEME } from '../utils/constants'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

const Wallet = () => {
    const router = useRouter()
    const web3Connect = useWeb3React();

    const connect = () => {
        web3Connect.activate(injected, (error) => {
            // todo: present toast notifications
            console.error('connection error: ', error);
            if (error instanceof UserRejectedRequestError) {
                // ignore user rejected error
            } else {
                web3Connect.setError(error)
            }
        }, false)
    }

    return (
        <>
            {!web3Connect.active && 
                <Menu>
                    <MenuButton as={Button} bg="gray.700" color="brand.400" rightIcon={<ChevronDownIcon />}>
                        Connect
                    </MenuButton>
                    <MenuList>
                        <MenuItem bg="gray.700" color="brand.400" onClick={connect}>Metamask</MenuItem>
                    </MenuList>
                </Menu>
            }
            {web3Connect.active && typeof web3Connect.account === 'string' && typeof web3Connect.chainId === 'number' && 
                <>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Flex alignItems='center'>
                                <Box>{formatAddress(web3Connect.account)}</Box>
                            </Flex>
                        </MenuButton>
                        <MenuList>
                            <NextLink href="/profile" passHref={true}>
                                <MenuItem bg="gray.700" color="brand.400">Profile</MenuItem>
                            </NextLink>
                        </MenuList>
                    </Menu>
                </>
            }
        </>
    )
}

export default Wallet;