import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  Image,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useMediaQuery,
  Spinner,
  Textarea
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import web3 from "web3";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from "axios";
import { useAppState } from "../../../context/appState";
import lit from '../../../utils/lit';
import { useSignMessage, useContract, useSigner, useContractReads, useAccount, useProvider, useContractRead } from 'wagmi'
import ItemToken from "../../../artifacts/contracts/tokens/ItemToken.sol/ItemToken.json";
import { SIGNATURE_MESSAGE } from '../../../utils/constants';
import { BigNumber } from 'bignumber.js';

interface Props {
    nftAddress: string;
}
export function createAndDownloadBlobFile(body, filename, extension = 'zip') {
    const blob = new Blob([body]);
    const fileName = `${filename}.${extension}`;
    const link = document.createElement('a');
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }
// @ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const NFTPage = (props: Props) => {
    const [qty, setQty] = useState<number>(1);
    console.log('props ', props);
    const provider = useProvider()
    const { address } = useAccount()
    const { data: signer } = useSigner()
    const itemTokenContract = useContract({
      addressOrName: props.nftAddress,
      contractInterface: ItemToken.abi,
      signerOrProvider: provider,
    });
    const [tokenURI, setTokenURI] = useState<string | undefined>();
    const [metadata, setMetadata] = useState<any>();
    const [balance, setBalance] = useState<any>();
    const [owner, setOwner] = useState<any>();
    const [shopAddress, setShopAddress] = useState<string | undefined>();
    const {
        cart,
        cartMetaData,
        catalogItems,
        setCatalogItems,
        setCart,
        setCartMetaData,
        cartShopAddress,
        setCartShopAddress,
      } = useAppState();
    useEffect(() => {
        fetchNFTData();
    }, []);

    const fetchNFTData = async () => {
        const _tokenURI = await itemTokenContract.tokenURI(1);
        setTokenURI(_tokenURI);
        const _shopAddress = await itemTokenContract.shop();
        setShopAddress(_shopAddress);
        const _metadata = await  axios.get(_tokenURI);
        // setMetadata({ ..._metadata.data, itemId: '1', price: '100000000000000000' });
        // todo: dev mode
        setMetadata({
          ..._metadata.data,
          itemId: '1',
          price: '100000000000000000',
          shopAddress: _shopAddress
        });

        const _balance = await itemTokenContract.balanceOf(address);
        setBalance(_balance);
        
        const _owner = await itemTokenContract.owner();
        setOwner(_owner);
    }
  const handleDownload = async () => {
    console.log('decrypt yo', SIGNATURE_MESSAGE, signer);

    let signature = await signer.signMessage(SIGNATURE_MESSAGE);
    console.log(signature);
      // stage 2 - sign message and upload file

    let authSig = {
      sig: signature,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: SIGNATURE_MESSAGE,
      address,
    };

    const { decryptedFile } = await lit.decrypt(
        metadata.file,
        metadata.encryptedSymmetricKey,
        props.nftAddress,
        authSig
    )
    function Download(arrayBuffer, type) {
      var blob = new Blob([arrayBuffer], { type: type });
      var url = URL.createObjectURL(blob);
      window.open(url);
    }
    createAndDownloadBlobFile(decryptedFile, 'cyber-punk', 'zip');
    console.log('decryptedFile -', decryptedFile);
  }

  const handleAddToCart = () => {
    const id = metadata.itemId || '1';

    if (metadata.shopAddress !== cartShopAddress) {
      setCartShopAddress(metadata.shopAddress);
    }

    if (cartMetaData.hasOwnProperty(id)) {
      const currCart = cart.map((item: any) => {
        console.log("item.itemId === id", item.itemId, id);
        if (item.itemId === id) {
          return {
            ...item,
            qty: item.qty + Number(qty),
          };
        }
        return item;
      });
      setCart(currCart);
    } else {
      setCart([
        ...cart,
        { qty: Number(qty), itemId: metadata.itemId },
      ]);
    }
    setCartMetaData({
      ...cartMetaData,
      [metadata.itemId]: {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        price: new BigNumber(web3.utils.fromWei(metadata.price || '10000000000000000', 'ether')),
      },
    });
  };
  if (!props.nftAddress) {
    return <h1>Yikes. Try navigating to this page from the home page</h1>;
  }
  return (
    <Box>
      <Flex justify={"center"} align={"center"} direction={"column"}>
        <Box m="6" width={"1200px"} textAlign="left">
          <Flex
            justify="center"
            align="center"
            direction={"row"}
          >
            <Image
              borderRadius="12px"
              src={metadata?.image}
              width={"200px"}
              height={"200px"}
              mr="6"
              boxShadow="xl"
            />
            <Box>
              {" "}
              <Text fontSize="4xl" className="title">{metadata?.name}</Text>
              <Text color="gray.600">{metadata?.description}</Text>
              <Text color="yello.700">stars: {4.75}</Text>
              <Text color="gray.600">balance: {balance?.toString()}</Text>
              <Flex mb={"2"} direction="column">
                <Link
                  target={"_blank"}
                  mb={"2"}
                  href={`${process.env.NEXT_PUBLIC_ETHERSCAN}/${props.nftAddress}`}
                  color="gray.600"
                  isExternal
                >
                  <ExternalLinkIcon />
                  NFT address: {props.nftAddress.slice(0, 4)}...{props.nftAddress.slice(-4)}
                </Link>
              </Flex>
                <Flex justify="left" align="center">
                <Text fontSize="lg" m="2">Quantity</Text>
                <Input
                    placeholder="Quantity"
                    width="80px"
                    onChange={(e: any) => setQty(e.target.value)}
                    value={qty}
                    mr={"4"}
                />
                <Button m={'2'} bg={'brand.seduce'} _hover={{ bg: 'brand.seduceHover' }} onClick={handleAddToCart}>Add to Cart</Button>
                </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
        <Flex justify="center" align="center">
            <Box m="4">
                <Button onClick={handleDownload} bg={'brand.independence'} _hover={{ bg: 'brand.independenceHover'}}>Download File</Button>
            </Box>
        </Flex>
    </Box>
  );
};

NFTPage.getInitialProps = async (ctx) => {

    const nftAddress = ctx.query.nftAddress;
    return {
        nftAddress: nftAddress
    }
}
export default NFTPage;
