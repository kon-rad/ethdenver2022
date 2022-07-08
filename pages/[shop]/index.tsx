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
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import CatalogItem from "../../components/catalogItem";
import Shop from "../../artifacts/contracts/Shop.sol/Shop.json";
import ItemToken from "../../artifacts/contracts/tokens/ItemToken.sol/ItemToken.json";
import { handleImageUpload, encryptFile } from "../../utils/ipfs";
import TransactionItem from "../../components/transactionItem";
import web3 from "web3";
import { formatAddress } from "../../utils/web3";
import { getAffiliates, makeAffiliateProposal, updateAffiliate } from "../../utils/shop";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from "axios";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    getFirestore,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import lit from '../../utils/lit';
import { useSignMessage, useContract, useSigner, useContractReads, useAccount, useProvider, useContractRead } from 'wagmi'

interface Props {}

interface CartType {
  qty: number;
  itemId: string;
}

const SIGNATURE_MESSAGE = 'why yes I am the owner of this NFT on dcom.market!';

// @ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const db = getFirestore();

const ShopPage = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [lastTokenId, setLastTokenId] = useState<number | undefined>();
  const [desc, setDesc] = useState<string>("");
  // const [image, setImage] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [digitalProductFile, setDigitalProductFile] = useState<string>("");
  const [digitalProductFileRef, setDigitalProductFileRef] = useState<string>("");
  const [proposedAffiliates, setProposedAffiliates] = useState([]);
  const [activeAffiliates, setActiveAffiliates] = useState([]);
  const [percent, setPercent] = useState("3");
  const [encryptedUrl, setEncryptedUrl] = useState<string>("");

  const [itemName, setItemName] = useState<string>("");
  const [itemDesc, setItemDesc] = useState<string>("");
  const [itemImage, setItemImage] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<string>("");

  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const provider = useProvider();
  const { data: signer } = useSigner();
  const router = useRouter();
  const { address } = useAccount();
  const { data: signMessageData, isError: signMessageIsError, isLoading: signMessageIsLoading, isSuccess: signMessageIsSuccess, signMessage } = useSignMessage({
    message: SIGNATURE_MESSAGE,
  })

  const shopContractData = {
    addressOrName: router.query.shop,
    contractInterface: Shop.abi,
  }
  let name = "";
  let image = "";
  let owner = "";
  let tags = "";
  let nftAddress = "";
  let items = [];
  let transactions = [];

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...shopContractData,
        functionName: 'name',
      },
      {
        ...shopContractData,
        functionName: 'image',
      },
      {
        ...shopContractData,
        functionName: 'owner',
      },
      {
        ...shopContractData,
        functionName: 'tags',
      },
      {
        ...shopContractData,
        functionName: 'nftAddress',
      },
      {
        ...shopContractData,
        functionName: 'fetchCatalogItems',
      },
      {
        ...shopContractData,
        functionName: 'fetchTransactions',
      }
    ] as any
  })
  if (data) {
    [name, image, owner, tags, nftAddress, items, transactions] = [...data] as any ;
  }

  useEffect(() => {
    getNftData();
  }, [data]);

  useEffect(() => {
    if (!router.query.shop) return;
    getAffiliates(
      provider,
      setProposedAffiliates,
      setActiveAffiliates,
      Shop.abi,
      router.query.shop
    );
  }, [router.query.shop]);
  
  useEffect(() => {
    setIsOwner(address === owner);
  }, [address, owner]);

  const getNftData = async () => {

    console.log("nftAddress -> ", nftAddress);
    if (!provider || lastTokenId || !nftAddress) return;

    const itemTokenContract = new ethers.Contract(
      nftAddress,
      ItemToken.abi,
      provider
    );
    setLastTokenId(await itemTokenContract.getTotal());
  };

  const handleCreate = async () => {
    try {
      const shopContract = new ethers.Contract(
        router.query.shop,
        Shop.abi,
        signer
      );

      if (!itemPrice) {
        throw Error("Item price is required");
      }
      const currTokenId = lastTokenId;
      await shopContract.createItem(
        web3.utils.toWei(itemPrice, "ether"),
        ""
      );
      // const { data: signMessageData, isError: signMessageIsError, isLoading: signMessageIsLoading, isSuccess: signMessageIsSuccess, signMessage } = useSignMessage({

      let authSig = {
        sig: signMessageData,
        derivedVia: "web3.eth.personal.sign",
        signedMessage: SIGNATURE_MESSAGE,
        address,
      };
      //   {
      //     "sig": "0x18720b54cf0d29d618a90793d5e76f4838f04b559b02f1f01568d8e81c26ae9536e11bb90ad311b79a5bc56149b14103038e5e03fee83931a146d93d150eb0f61c",
      //     "derivedVia": "web3.eth.personal.sign",
      //     "signedMessage": "localhost wants you to sign in with your Ethereum account:\n0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a\n\nThis is a test statement.  You can put anything you want here.\n\nURI: https://localhost/login\nVersion: 1\nChain ID: 1\nNonce: gzdlw7mR57zMcGFzz\nIssued At: 2022-04-15T22:58:44.754Z",
      //     "address": "0x1cD4147AF045AdCADe6eAC4883b9310FD286d95a"
      // }
      console.log('authSig -> ', authSig);

      const {
        encryptedFileIPFSHash,
        encryptedSymmetricKey
      } = await lit.encrypt(digitalProductFileRef, nftAddress, currTokenId, authSig);
      console.log('file encrypted, encryptedFileIPFSHash, encryptedSymmetricKey - ', encryptedFileIPFSHash, encryptedSymmetricKey)

      /* first, upload to IPFS */
      const data = JSON.stringify({
          name: itemName,
          description: itemDesc,
          image: itemImage,
          file: encryptedFileIPFSHash,
          encryptedSymmetricKey: encryptedSymmetricKey
          // external_url
      });
      const added = await client.add(data);
      const ipfsHash = `${added.path}`;
      
      const nftContract = new ethers.Contract(
        nftAddress,
        ItemToken.abi,
        signer
      );
      await nftContract.setTokenURI(
        currTokenId,
        ipfsHash
      );
      console.log('set token uri, currTokenId, ipfsHash: ', currTokenId, ipfsHash)

      toast(`You successfully created ${itemName}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error(`Error: ${e.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  const signMessageLocally = () => {

    signMessage();
  }
  const handleEdit = () => {
    console.log("edit ");
  };
  const uploadImage = async (e: any) => {
    setItemImage(await handleImageUpload(e));
  };

  const uploadDigitalProduct = async (e: any) => {
    setDigitalProductFileRef(e);
  }
  
  if (!router.query.shop) {
    return <h1>Yikes. Try navigating to this page from the home page</h1>;
  }
  const renderAffiliate = (aff: any, isApproved: boolean) => {
    return (
      <Flex mb="2" direction="row" align="center" key={aff.affAddr}>
        <Text mr="4">affiliate {formatAddress(aff.affAddr)}</Text> 
        <Text mr="4">percentage:{" "} {aff.percentage?.toString()}{"%"}</Text> 
        <Button
          onClick={() =>
            updateAffiliate(aff.affAddr, provider, router.query.shop, Shop.abi, isApproved)
          }
        >
          {isApproved ? "Cancel" : "Approve"}
        </Button>
      </Flex>
    );
  };
  const renderAffiliateTab = () => {
    if (isOwner) {
      return (
        <Flex flexDirection="column" justify="center">
          <Text fontSize="2xl" fontWeight="bold" mb="2">Proposals:</Text>
          {
            proposedAffiliates.filter(
              (aff: any) => aff.percentage?.toString() != '0').map((aff: any) => renderAffiliate(aff, false)
            )
          }
          <Text fontSize="2xl" fontWeight="bold" mb="2">Active:</Text>
          {
            activeAffiliates.filter(
              (aff: any) => aff.percentage?.toString() != '0').map((aff: any) => renderAffiliate(aff, true)
            )
          }
        </Flex>
      );
    }
    return (
      <Box>
        <Box>
          <Text>Proposals:</Text>
            {
              proposedAffiliates
                .filter((aff: any) => aff.affAddr == address)
                .map((aff: any, i: number) => {
                  return (
                    <Box key={`proposed-aff-${i}`}>
                      <Text fontWeight="bold" fontSize="xl">
                        Your Affiliate proposal for {aff.percentage?.toString()}% is pending
                      </Text>
                    </Box>
                  )
                })
            }
          <Text>Active:</Text>
            {
              activeAffiliates
                .filter((aff: any) => aff.affAddr == address)
                .map((aff: any, i:number) => {
                  return (
                    <Box key={`aff-${i}`}>
                      <Text fontWeight="bold" fontSize="xl">
                        <a href={`${window.location.href}/${address}`}>
                          Here is your affiliate link for {aff.percentage?.toString()}%:
                        </a>
                      </Text>
                    </Box>
                  )
                })
            }
        </Box>
      
        <Text fontSize="xl">Become an Affiliate: </Text>
        <Flex direction="column" justify="center">
          <Text mb="2">Proposal for a % of each affiliate sale:</Text>
          <Input
            placeholder="percentage"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            mb="4"
          />
          <Button
            onClick={() =>
              makeAffiliateProposal(
                provider,
                router.query.shop,
                Shop.abi,
                percent
              )
            }
          >
            submit
          </Button>
        </Flex>
      </Box>
    );
  };
  return (
    <Box>
      <Flex justify={"center"} align={"center"} direction={"column"}>
        <Box m="6" width={isMobile ? "100%" : "600px"} textAlign="center">
          <Flex
            justify="center"
            align="center"
            direction={isMobile ? "column" : "row"}
          >
            <Image
              borderRadius="12px"
              src={image}
              width={isMobile ? "90%" : "200px"}
              height={isMobile ? "90%" : "200px"}
              mr="6"
              boxShadow="xl"
            />
            <Box>
              {" "}
              <Text fontSize="6xl">{name}</Text>
              <Text color="gray.600">{desc}</Text>
              <Text color="yello.700">stars: {4.75}</Text>
              <Flex mb={"2"} direction="column">
                <Link
                  target={"_blank"}
                  mb={"2"}
                  href={`${process.env.NEXT_PUBLIC_ETHERSCAN}${owner}`}
                  color="gray.600"
                  isExternal
                >
                  <ExternalLinkIcon />
                  owner: {owner.slice(0, 5)}...
                </Link>
                <Link
                  target={"_blank"}
                  mb={"2"}
                  href={`${process.env.NEXT_PUBLIC_ETHERSCAN}${router.query.shop}`}
                  color="gray.600"
                  isExternal
                >
                  <ExternalLinkIcon />
                  shop address: {router.query.shop.slice(0, 5)}...
                </Link>
              </Flex>
              <Flex color="white" >
                {tags.split(', ').map(
                  (tag: string, i: number) => (<Box key={`key-${tag}-${i}`} backgroundColor="brand.400" m="2" boxShadow="lg" py="1" px="2" borderRadius="8px">{tag}</Box>))
                }
              </Flex>
              <Flex m={"4"}>
                {isOwner && (
                  <Button mr={"4"} onClick={onOpen}>
                    Add Catalog Item
                  </Button>
                )}
                {isOwner && <Button onClick={handleEdit}>Edit Shop</Button>}
              </Flex>
            {/* <Button mr={"4"} onClick={downloadAndDecrypt}>download and decrypt file</Button> */}
            </Box>
          </Flex>

          <Tabs>
            <TabList>
              <Tab>Menu</Tab>
              <Tab>Transactions</Tab>
              <Tab>Affiliates</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex justify={"center"} align={"center"} direction={"column"}>
                  {items.map((elem: any, i: number) => !elem[2] && (
                    <CatalogItem
                      key={`item-${i}`}
                      data={elem}
                      nftAddress={nftAddress}
                      shopAddress={router.query.shop}
                      isOwner={isOwner}
                    />
                  ))}
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex justify={"center"} align={"center"} direction={"column"}>
                  {transactions.map((elem: any, i: number) => (
                    <TransactionItem
                      key={`aff-${i}`}
                      data={elem}
                      shopAddress={router.query.shop}
                      currentAddress={address}
                    />
                  ))}
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex justify={"center"} align={"center"} direction={"column"}>
                  {renderAffiliateTab()}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new catalog item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex justify="center">
              <Image
                borderRadius="12px"
                src={itemImage ? itemImage : "/images/placeholder-image.png"}
                width="200px"
                height="200px"
                boxShadow="xl"
              />
            </Flex>
            <Box mt={"4"}>
              <Text mb={"1"}>Upload NFT Image</Text>
              <Text mb={"2"} fontSize="xs">this image represents what the product is like</Text>
              <input
                type="file"
                name="Asset"
                className="mr-2"
                onChange={(e: any) => uploadImage(e)}
              />
            </Box>
            <Input
              placeholder="item name"
              value={itemName}
              onChange={(e: any) => setItemName(e.target.value)}
              mt={4}
            />
            <Input
              placeholder="description"
              value={itemDesc}
              onChange={(e: any) => setItemDesc(e.target.value)}
              mt={4}
            />
            <Input
              placeholder="price"
              value={itemPrice}
              onChange={(e: any) => setItemPrice(e.target.value)}
              mt={4}
            />
              <Box mt={"4"}>
                <Text mb={"1"}>Upload Digital Product</Text>
                <Text mb={"2"} fontSize="xs">your digital asset file</Text>
                <input
                  type="file"
                  name="Asset"
                  className="mr-2"
                  onChange={(e: any) => uploadDigitalProduct(e)}
                />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="primary" onClick={signMessageLocally}>
              Sign Message
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create Item
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ShopPage;
