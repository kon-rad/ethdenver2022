import { useWeb3React } from '@web3-react/core';
import { Button, Box, Flex, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { injected, formatAddress } from '../utils/web3'
import { UserRejectedRequestError } from '@web3-react/injected-connector'
import { DEFAULT_COLOR_SCHEME } from '../utils/constants'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { toast } from "react-toastify";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Wallet = () => {
    const router = useRouter()

    return (
        <>
            <Menu>
                <ConnectButton />
            </Menu>
        </>
    )
}

export default Wallet;