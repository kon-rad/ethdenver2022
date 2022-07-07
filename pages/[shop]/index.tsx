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
  RadioGroup,
  Stack,
  Radio
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import CatalogItem from "../../components/catalogItem";
import Shop from "../../artifacts/contracts/Shop.sol/Shop.json";
import { handleImageUpload, encryptFile } from "../../utils/ipfs";
import TransactionItem from "../../components/transactionItem";
import web3 from "web3";
import { formatAddress } from "../../utils/web3";
import { getAffiliates, makeAffiliateProposal, updateAffiliate } from "../../utils/shop";
import Web3Modal from "web3modal";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from "axios";
import { encrypt, decrypt } from "../../services/encryption";
import crypto from 'crypto';
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

interface Props {}

interface CartType {
  qty: number;
  itemId: string;
}

// @ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const db = getFirestore();

const ShopPage = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [owner, setOwner] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nftAddress, setNftAddress] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [image, setImage] = useState<string>("");
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

  const [items, setItems] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const web3React = useWeb3React();

  const provider = ethers.getDefaultProvider(process.env.NEXT_PUBLIC_NETWORK);

  const router = useRouter();
  console.log("router.query.shop: ", router.query.shop);
  useEffect(() => {
    getShopData();
  }, []);
  useEffect(() => {
    if (router.query.shop) {
      getAffiliates(
        web3React,
        setProposedAffiliates,
        setActiveAffiliates,
        Shop.abi,
        router.query.shop
      );
    }
  }, [router.query.shop]);
  
  useEffect(() => {
    setIsOwner(web3React.account === owner);
    console.log("addr changed isOwner: ", isOwner);
  }, [web3React.account, web3React, owner]);
  console.log("addr: ", web3React.account);

  const getShopData = async () => {
    if (!router.query.shop) return;

    console.log("getting shop data ", provider);
    const shopContract = new ethers.Contract(
      router.query.shop,
      Shop.abi,
      provider
    );
    setName(await shopContract.name());
    // setDesc(await shopContract.description());
    setImage(await shopContract.image());
    setOwner(await shopContract.owner());
    setNftAddress(await shopContract.nftAddress());

    setItems(await shopContract.fetchCatalogItems());
    setTransactions(await shopContract.fetchTransactions());
    console.log("shop data is set");
  };

  console.log("addr 2: & owner ", web3React.account, owner, isOwner);
  const handleCreate = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const providerWSigner = new ethers.providers.Web3Provider(connection);
    try {
      const signer = providerWSigner.getSigner();
      const {
        encryptedFileIPFSHash,
        encryptedSymmetricKey
    } = lit.encrypt(digitalProductFileRef, nftAddress, )

      /* first, upload to IPFS */
      const data = JSON.stringify({
          name: itemName,
          description: itemDesc,
          image: itemImage,
          encryptedAsset: encryptedAsset,
      });
      const added = await client.add(data);
      const ipfsHash = `${added.path}`;

      const shopContract = new ethers.Contract(
        router.query.shop,
        Shop.abi,
        signer
      );
      console.log(
        'creating item: metadtaUrl, file url', 
        ipfsHash,
        digitalProductFile
      );

      console.log('createItem: ', digitalProductFile, itemPrice);
      if (!itemPrice) {
        throw Error("Item price is required");
      }
      
      await shopContract.createItem(
        web3.utils.toWei(itemPrice, "ether"),
        digitalProductFile,
        ipfsHash
      );
      await getShopData();

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
  const handleEdit = () => {
    console.log("edit ");
  };
  const uploadImage = async (e: any) => {
    setItemImage(await handleImageUpload(e));
  };

  const saveKeyForFile = async (fileUrl: string, secretKey: string) => {
    // const keyRef = doc(db, 'fileKeys', web3React.account);
    debugger;
    console.log('save key for file: ', fileUrl);
    
    await addDoc(collection(db, 'fileKeys'), {
      tokenId: items.length,
      nftAddress: nftAddress,
      fileURI: fileUrl,
      ownerAddress: web3React.account,
      secretKey: secretKey,
    });
  }

  const completeFileEncryption = async (fileUrl: string, secretKey: string) => {
    setEncryptedUrl(fileUrl);
    await saveKeyForFile(fileUrl, secretKey);
  }

  const uploadDigitalProduct = async (e: any) => {
    console.log('uploadDigitalProduct e: ', e);
    setDigitalProductFileRef(e);
    return;
    // console.log('digital product');
    // let secretKey = crypto.randomBytes(48).toString('base64');
    // secretKey = crypto.createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32);

    // console.log('secretKey: ', secretKey);
    // // todo: encrypt file and set in SC
    // const res = await encryptFile(e, completeFileEncryption, secretKey);

    // console.log('encrypt res: ', res);
    // setDigitalProductFile(await handleImageUpload(e));
  }
  console.log("transactions: ", transactions);
  console.log("encryptedUrl: ", encryptedUrl);

  const downloadAndDecrypt = async () => {
    axios.get(encryptedUrl, {
      responseType: 'arraybuffer'
    })
    .then(response => {
      // Buffer.from(response.data, 'binary').toString('base64')
      // fs.writeFile('/temp/decrypted.md', response.data, (err) => {
      //   if (err) throw err;
      //   console.log('The file has been saved!');
      // });
      console.log("response data: ", response.data);

      const decrypted = decrypt(Buffer.from(response.data, 'binary'));

      const url = window.URL.createObjectURL(new Blob([decrypted]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'encrypted.txt');
      document.body.appendChild(link);
      link.click();
    })
  }
  
  if (!router.query.shop) {
    return <h1>Try navigating to this page from the home page</h1>;
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
            {proposedAffiliates.filter((aff: any) => aff.percentage?.toString() != '0').map((aff: any) => renderAffiliate(aff, false))}
          <Text fontSize="2xl" fontWeight="bold" mb="2">Active:</Text>
            {activeAffiliates.filter((aff: any) => aff.percentage?.toString() != '0').map((aff: any) => renderAffiliate(aff, true))}
        </Flex>
        );
    }
    return (
      <Box>
        <Box>
          <Text>Proposals:</Text>
            {
              proposedAffiliates
                .filter((aff: any) => aff.affAddr == web3React.account)
                .map((aff: any, i: number) => {
                  return (
                    <Box key={`proposed-aff-${i}`}>
                      <Text fontWeight="bold" fontSize="xl">Your Affiliate proposal for {aff.percentage?.toString()}% is pending</Text>
                    </Box>
                  )
                })
            }
          <Text>Active:</Text>
            {
              activeAffiliates
                .filter((aff: any) => aff.affAddr == web3React.account)
                .map((aff: any, i:number) => {
                  return (
                    <Box key={`aff-${i}`}>
                      <Text fontWeight="bold" fontSize="xl"> <a href={`${window.location.href}/${web3React.account}`}>Here is your affiliate link for {aff.percentage?.toString()}%:</a></Text>
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
            {/* <Box width={isMobile ? "90%" : "200px"} m="2"> */}
            <Image
              borderRadius="12px"
              src={image}
              width={isMobile ? "90%" : "200px"}
              height={isMobile ? "90%" : "200px"}
              mr="6"
            />
            {/* </Box> */}
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
              <Flex m={"4"}>
                {isOwner && (
                  <Button mr={"4"} onClick={onOpen}>
                    Add Catalog Item
                  </Button>
                )}
                {isOwner && <Button onClick={handleEdit}>Edit Shop</Button>}
              </Flex>
            <Button mr={"4"} onClick={downloadAndDecrypt}>download and decrypt file</Button>
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
                    <CatalogItem key={`item-${i}`} data={elem} nftAddress={nftAddress} shopAddress={router.query.shop} isOwner={isOwner} />
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
                      currentAddress={web3React.account}
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
                <Text mb={"2"} fontSize="xs">any digital asset file that you intend to sell</Text>
                <input
                  type="file"
                  name="Asset"
                  className="mr-2"
                  onChange={(e: any) => uploadDigitalProduct(e)}
                />
            </Box>
          </ModalBody>

          <ModalFooter>
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
