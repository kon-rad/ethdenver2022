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
import { ExternalLinkIcon, CheckCircleIcon } from "@chakra-ui/icons";
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
import lit from '../../utils/lit';
import { useSignMessage, useContractEvent, useSigner, useContractReads, useAccount, useProvider, useContractRead } from 'wagmi'
import { SIGNATURE_MESSAGE } from '../../utils/constants';

interface Props {
  shop: string;
}

interface CartType {
  qty: number;
  itemId: string;
}


// @ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const ShopPage = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [desc, setDesc] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [items, setItems] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);
  const [itemAddresses, setItemAddresses] = useState<any>([]);

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [digitalProductFile, setDigitalProductFile] = useState<string>("");
  const [digitalProductFileRef, setDigitalProductFileRef] = useState<string>("");
  const [proposedAffiliates, setProposedAffiliates] = useState([]);
  const [activeAffiliates, setActiveAffiliates] = useState([]);
  const [percent, setPercent] = useState("3");
  const [encryptedUrl, setEncryptedUrl] = useState<string>("");
  const [newItemCreated, setNewItemCreated] = useState<any>();
  const [newItemAddress, setNewItemAddress] = useState<any>("");
  const [newItemId, setNewItemId] = useState<number | undefined>();
  const [createItemStage, setCreateItemStage] = useState<number>(1);
  const [encryptedFileURL, setEncryptedFileURL] = useState<string | undefined>();
  const [encryptedSymmetricKey, setEncryptedSymmetricKey] = useState<any>();
  const [completedFlow, setCompletedFlow] = useState<boolean>(false);
  const [stagePending, setStagePending] = useState<number>(0);

  const [itemName, setItemName] = useState<string>("");
  const [itemSymbol, setItemSymbol] = useState<string>("");
  const [itemDesc, setItemDesc] = useState<string>("");
  const [itemImage, setItemImage] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<string>("");
  const router = useRouter();

  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  useContractEvent({
    addressOrName: props.shop,
    contractInterface: Shop.abi,
    eventName: 'ItemCreated',
    listener: (event) => handleItemCreatedEvent(event),
  })

  const handleItemCreatedEvent = (event: any) => {
    console.log('item created event - ', event);
    if (event.itemId === newItemId) {
      setNewItemAddress(event[1]);
      setCreateItemStage(2);
    }
  }
  const shopContractData = {
    addressOrName: props.shop,
    contractInterface: Shop.abi,
  }

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
        functionName: 'fetchCatalogItems',
      },
      {
        ...shopContractData,
        functionName: 'fetchTransactions',
      },
      {
        ...shopContractData,
        functionName: 'getItemAddresses',
      }
    ] as any
  })
  useEffect(() => {
    if (!data) return;
    let [_name, _image, _owner, _tags, _items, _transactions, _itemAddresses] = [...data] as any;
    setName(_name);
    setImage(_image);
    setOwner(_owner);
    setTags(_tags);
    setItems(_items);
    setTransactions(_transactions);
    setItemAddresses(_itemAddresses);
  }, [data])

  useEffect(() => {
    if (!props.shop) return;
    getAffiliates(
      provider,
      setProposedAffiliates,
      setActiveAffiliates,
      Shop.abi,
      props.shop
    );
  }, [props.shop]);
  
  useEffect(() => {
    setIsOwner(address === owner);
  }, [address, owner]);

  const handleStage1 = async () => {
    try {
      const shopContract = new ethers.Contract(
        props.shop as any,
        Shop.abi,
        signer
      );

      if (!itemPrice) {
        throw Error("Item price is required");
      }
      setNewItemId(items.length + 1);

      /* first, upload to IPFS */
      const data = JSON.stringify({
          name: itemName,
          description: itemDesc,
          image: itemImage,
          shopAddress: props.shop,
          price: itemPrice,
          itemId: items.length + 1,
          // file: encryptedFileIPFSHash,
          // encryptedSymmetricKey: encryptedSymmetricKey
          // file: 'some file here',
          // encryptedSymmetricKey: 'encrypted symmetric key'
          // external_url
      });
      setStagePending(1);
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      const createResponse = await shopContract.createItem(
        itemName,
        itemSymbol,
        web3.utils.toWei(itemPrice, "ether"),
        url
      );
      console.log('createResponse - ', createResponse);
      const receipt = await createResponse.wait();
      console.log('receipt --- ', receipt);
      const freshItems = await shopContract.fetchCatalogItems();
      setItems(freshItems);
      console.log('freshItems: ', freshItems);
      setNewItemAddress(freshItems[freshItems.length - 1].itemAddress);
      setCreateItemStage(2);
      console.log('freshItems freshItems ----- ', freshItems);
      setStagePending(0);
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
  const handleStage2 = async () => {
    if (createItemStage !== 2) {
      console.error("Error: item creation stage is not correct.");
      return;
    }
    setStagePending(2);

    let signature = await signer.signMessage(SIGNATURE_MESSAGE);
    console.log(signature);
      // stage 2 - sign message and upload file

    let authSig = {
      sig: signature,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: SIGNATURE_MESSAGE,
      // user address
      address,
    };
    console.log('authSig -> ', authSig);

    const {
      encryptedFileURL,
      encryptedSymmetricKey
    } = await lit.encrypt(digitalProductFileRef, newItemAddress, authSig);
    console.log('file encrypted, encryptedFileURL, encryptedSymmetricKey - ', encryptedFileURL, encryptedSymmetricKey)
    setEncryptedFileURL(encryptedFileURL);
    setEncryptedSymmetricKey(encryptedSymmetricKey);
    // stage 3 - update token URI
    setCreateItemStage(3);
    setStagePending(0);

  }
  const handleStage3 = async () => {
    setStagePending(3);

    if (createItemStage !== 3) {
      console.error("Error: item creation stage is not correct.");
      return;
    }
    const itemContract = new ethers.Contract(
      newItemAddress,
      ItemToken.abi,
      signer
    );

    const newItemUri = await itemContract.tokenURI(1);
    const metadata = await axios.get(newItemUri);
    console.log('newItemUri -> ', newItemUri);
    console.log('metadata -> ', metadata);
    console.log('encryptedFileURL -> ', encryptedFileURL);
    console.log('encryptedSymmetricKey -> ', encryptedSymmetricKey);

    const data = JSON.stringify({
      ...metadata.data,
      file: encryptedFileURL,
      encryptedSymmetricKey: encryptedSymmetricKey,
      // file: 'some file here',
      // encryptedSymmetricKey: 'encrypted symmetric key'
      // todo: optional field -> 
      // external_url
  });
  const added = await client.add(data);
  const ipfsHash = `${added.path}`;
  const url = `https://ipfs.infura.io/ipfs/${added.path}`;

    
    await itemContract.setTokenURI(
      1,
      url
    );
    console.log('set token uri, currTokenId, ipfsHash: ', ipfsHash)

    toast(`You successfully created ${itemName}!`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setCreateItemStage(1);
    setCompletedFlow(true);
    onClose();
    setStagePending(0);
  }
  const handleEdit = () => {
    console.log("edit ");
  };
  const uploadImage = async (e: any) => {
    setItemImage(await handleImageUpload(e));
  };

  const uploadDigitalProduct = async (e: any) => {
    console.log("e.target.files[0] -> ", e.target.files[0]);
    setDigitalProductFileRef(e.target.files[0]);
  }
  
  if (!props.shop) {
    return <h1>Yikes. Try navigating to this page from the home page</h1>;
  }
  const renderAffiliate = (aff: any, isApproved: boolean) => {
    return (
      <Flex mb="2" direction="row" align="center" key={aff.affAddr}>
        <Text mr="4">affiliate {formatAddress(aff.affAddr)}</Text> 
        <Text mr="4">percentage:{" "} {aff.percentage?.toString()}{"%"}</Text> 
        <Button
          onClick={() =>
            updateAffiliate(aff.affAddr, provider, props.shop, Shop.abi, isApproved)
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
                props.shop,
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
        <Box m="6" width={isMobile ? "100%" : "1200px"} textAlign="center">
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
              <Text fontSize="4xl" className="title">{name}</Text>
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
                  owner: {owner && owner.slice(0, 5)}...
                </Link>
                <Link
                  target={"_blank"}
                  mb={"2"}
                  href={`${process.env.NEXT_PUBLIC_ETHERSCAN}${props.shop}`}
                  color="gray.600"
                  isExternal
                >
                  <ExternalLinkIcon />
                  shop address: {props.shop.slice(0, 5)}...
                </Link>
              </Flex>
              <Flex color="white" >
                {tags && tags.split(', ').map(
                  (tag: string, i: number) => (<Box key={`key-${tag}-${i}`} backgroundColor="brand.lowKeyKool" _hover={{ bg: 'brand.lowKeyKoolHover' }} color="black" m="2" boxShadow="lg" py="1" px="2" borderRadius="8px">{tag}</Box>))
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
        </Box>
      </Flex>

      <Box className="pink-box">
        <Flex justify="center">
          <Box width="1200px">

        <Tabs>
            <TabList>
              <Tab>Menu</Tab>
              <Tab>Transactions</Tab>
              <Tab>Affiliates</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex justify={"center"} align={"center"} direction={"column"}>
                  {items && items.map((elem: any, i: number) => !elem[2] && (
                    <CatalogItem
                      key={`item-${i}`}
                      data={elem}
                      nftAddress={elem.itemAddress}
                      shopAddress={props.shop}
                      isOwner={isOwner}
                    />
                  ))}
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex justify={"center"} align={"center"} direction={"column"}>
                  {transactions && transactions.map((elem: any, i: number) => (
                    <TransactionItem
                      key={`aff-${i}`}
                      data={elem}
                      shopAddress={props.shop}
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
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <Box>
            <ModalHeader>Create a new catalog item</ModalHeader>
            <ModalCloseButton />
            <ModalBody >
              <Box className="purple-box">
                <Flex justify="center" align="center" direction="row">
                  {createItemStage > 1 && <CheckCircleIcon w="50px" h="50px" color={"brand.confirmed"}/>}
                  <Text textAlign="center" className="title" fontWeight="bold" fontSize="3xl" m={4}>
                    Step 1: Create NFT 
                  </Text>
                </Flex>
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
                    mt={4}
                    mb="1"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setItemSymbol((e.target.value || "").toUpperCase().replace(" ", "").slice(0, 10))
                    }
                    width="180px"
                    value={itemSymbol}
                    name={"symbol"}
                    placeholder={"NFT symbol"}
                  />
                <Text fontSize="xs" mb="2">All caps, no spaces, 10 max character length</Text>
                <Textarea
                  placeholder="description"
                  value={itemDesc}
                  onChange={(e: any) => setItemDesc(e.target.value)}
                  mt={4}
                />
                <Input
                  placeholder="price"
                  value={itemPrice}
                  width="180px"
                  onChange={(e: any) => setItemPrice(e.target.value)}
                  mt={4}
                />
                <Flex direction="row" justify={'center'} align="center">
                    {stagePending === 1 && <Spinner  color="brand.seduce" mr="4" />}
                  <Box>
                    <Button disabled={stagePending === 1  || createItemStage !== 1} _hover={{ bg: 'brand.independenceHover' }} bg={'brand.independence'} onClick={handleStage1}>
                      Create Item
                    </Button>
                  </Box>
                </Flex>

              </Box>
              <Box className="yellow-green-orange-box">
              <Flex direction="column">
                <Flex justify="center" align="center" direction="row">
                  <Text textAlign="center" className="title" fontWeight="bold" fontSize="3xl" m={4}>Step 2: Upload Content</Text>
                  {createItemStage > 2 && <CheckCircleIcon w="50px" h="50px" color={"brand.confirmed"}/>}
                </Flex>
                <Box mt={"4"}>
                  <Text mb={"1"}>Upload Digital Product</Text>
                  <Text mb={"2"} fontSize="xs">your digital asset file</Text>
                  <input
                    type="file"
                    name="Asset"
                    className="mr-2"
                    disabled={!(createItemStage == 2)}
                    onChange={uploadDigitalProduct}
                  />
                </Box>
                <Flex direction="row" justify={'center'} align="center">
                    {stagePending === 2 && <Spinner color="brand.seduce" mr="4" />}
                  <Box>
                    <Button disabled={stagePending === 2 || createItemStage !== 2} _hover={{ bg: 'brand.independenceHover' }} bg={'brand.independence'}  onClick={handleStage2}>
                      Sign Message
                    </Button>
                  </Box>
                </Flex>
              </Flex>

              </Box>
              <Box className="blue-purple-box">
                <Flex direction="column">
                <Flex justify="center" align="center" direction="row">
                 <Text textAlign="center" className="title" fontWeight="bold" fontSize="3xl" m={4}>Step 3: Attach Content to NFT</Text>
                </Flex>
                  <Flex direction="row" justify={'center'} align="center">
                    <Box>
                      {stagePending === 3 && <Spinner color="brand.seduce" mr="4" />}
                      <Button disabled={stagePending === 3 || createItemStage !== 3} _hover={{ bg: 'brand.independenceHover' }} bg={'brand.independence'} onClick={handleStage3}>
                        Attach
                      </Button>
                    </Box>
                  </Flex>
                </Flex>

              </Box>
            </ModalBody>
            <ModalFooter>
              <Button bg={"brand.active"} _hover={{ bg: "brand.activeHover" }} mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
};

ShopPage.getInitialProps = async (ctx) => {
  // this gives the shop address on first render - using router.query.shop causes Error on frist render
  const shopAddress = ctx.query.shop;
  return {
    shop: shopAddress
  }
}
export default ShopPage;
