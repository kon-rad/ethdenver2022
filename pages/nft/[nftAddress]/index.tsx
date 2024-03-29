import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  Image,
  Link,
  Input,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import web3 from "web3";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from "axios";
import { useAppState } from "../../../context/appState";
import lit from '../../../utils/lit';
import { useContract, useSigner, useAccount, useProvider } from 'wagmi'
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
    const [itemId, setItemId] = useState<any>();
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
        const _itemId = await itemTokenContract.itemId();
        setItemId(_itemId.toNumber());
        const _metadata = await  axios.get(_tokenURI);
        // setMetadata({ ..._metadata.data, itemId: '1', price: '100000000000000000' });
        // todo: dev mode
        setMetadata({
          ..._metadata.data,
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
    const fileName = metadata.fileName || 'cyber-punk';
    const extension = metadata.extension || 'zip';

    createAndDownloadBlobFile(decryptedFile, fileName, extension);
    console.log('decryptedFile -', decryptedFile);
  }
  console.log('item id ', itemId);
  

  const handleAddToCart = () => {
    const id = itemId;

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
        { qty: Number(qty), itemId: itemId },
      ]);
    }
    setCartMetaData({
      ...cartMetaData,
      [itemId]: {
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
          <Box textAlign="center">
            <Text fontSize="xl" >Access Panel</Text>
              <Text color="gray.600">your balance: {balance?.toString()}</Text>
              <Box m="4">
                  <Button disabled={Number(balance?.toString()) === 0} onClick={handleDownload} bg={'brand.independence'} _hover={{ bg: 'brand.independenceHover'}}>Download File</Button>
              </Box>
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
