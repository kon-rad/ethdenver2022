import { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useMediaQuery,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import CatalogItem from "../../../components/catalogItem";
import Shop from "../../../artifacts/contracts/Shop.sol/Shop.json";
import TransactionItem from "../../../components/transactionItem";
import { useAppState } from "../../../context/appState";

interface Props {}

interface CartType {
  qty: number;
  itemId: string;
}

const ShopPageWithAffiliate = (props: Props) => {
  const [owner, setOwner] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [items, setItems] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const {
    affiliate,
    setAffiliate,
  } = useAppState();

  const web3React = useWeb3React();

  const provider = web3React.library;

  const router = useRouter();
  useEffect(() => {
    getShopData();
    setAffiliate(router.query.affiliate);
  }, [web3React.account]);
  useEffect(() => {
    // getShopData();
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
    setDesc(await shopContract.description());
    setImage(await shopContract.image());
    setOwner(await shopContract.owner());

    setItems(await shopContract.fetchCatalogItems());
    setTransactions(await shopContract.fetchTransactions());
    console.log("shop data is set", items, transactions);
  };

  console.log("render: ", router.query);
  console.log("render shop data", items, transactions);

  console.log("addr 2: & owner ", web3React.account, owner, isOwner);
  if (!router.query.shop) {
    return <h1>Try navigating to this page from the home page</h1>;
  }
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
            </Box>
          </Flex>

          <Tabs>
            <TabList>
              <Tab>Menu</Tab>
              <Tab>Transactions</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Flex justify={"center"} align={"center"} direction={"column"}>
                  {items.map((elem: any) => (
                    <CatalogItem data={elem} shopAddress={router.query.shop} />
                  ))}
                </Flex>
              </TabPanel>
              <TabPanel>
                <Flex justify={"center"} align={"center"} direction={"column"}>
                  {transactions.map((elem: any) => (
                    <TransactionItem
                      data={elem}
                      shopAddress={router.query.shop}
                    />
                  ))}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  );
};

export default ShopPageWithAffiliate;
