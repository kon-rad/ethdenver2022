import { useState, useEffect } from "react";
import { Box, Text, Flex, Button, Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input, } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useWeb3React } from '@web3-react/core';
import { ethers } from "ethers";
import CatalogItem from "../../components/catalogItem";
import Shop from "../../artifacts/contracts/Shop.sol/Shop.json";
import { handleImageUpload } from '../../utils/ipfs';

interface Props {}
const ShopPage = (props: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  const [owner, setOwner] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [itemName, setItemName] = useState<string>("");
  const [itemDesc, setItemDesc] = useState<string>("");
  const [itemImage, setItemImage] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<string>("");


  const [items, setItems] = useState<any>([]);

  const web3 = useWeb3React();

  const router = useRouter();
  useEffect(() => {
    getShopData();
  }, []);
  useEffect(() => {
    setIsOwner(web3.account === owner);
    console.log("addr changed isOwner: ", isOwner);

  }, [web3.account]);
  console.log("addr: ", web3.account);

  const getShopData = async () => {
      debugger; 
    if (!router.query.shop) return;

    const provider = new ethers.providers.JsonRpcProvider();

    console.log('getting shop data ', web3.library)
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
  };

  console.log("addr 2: ", web3.account);
  const handleCreate = () => {
    console.log('add item ');

  }
  const handleEdit = () => {
    console.log('edit ');
  }
  

  return (
    <Box>
      <Flex justify={"center"} align={"center"} direction={"column"}>
        <Box m="6" width="600px" textAlign="center">
          <Flex>
            <Box width="200px" m="2">
              <Image src={image} width="200px" height="200px" />
            </Box>
            <Box>
              <Text fontSize="2xl" color="black.700">
                {name}
              </Text>
              <Text color="gray.600">{desc}</Text>
              owner: {owner}
              {isOwner && <Button onClick={onOpen}>Add Catalog Item</Button>}
              {isOwner && <Button onClick={handleEdit}>Edit Shop</Button>}
            </Box>
          </Flex>
          <Text fontSize="6xl">{name}</Text>
        </Box>
      </Flex>
      <Flex justify={"center"} align={"center"} direction={"column"}>
        {items.map((elem: any) => (
          <CatalogItem data={elem} />
        ))}
      </Flex>


      <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create a new catalog item</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            placeholder="item name"
                            value={itemName}
                            onChange={(e: any) => setItemName(e.target.value)}
                            mt={4}
                        />
                        <Input
                            placeholder="description"
                            value={itemDesc}
                            onChange={(e: any) =>
                                setItemDesc(e.target.value)
                            }
                            mt={4}
                        />
                        <Input
                            placeholder="price"
                            value={itemPrice}
                            onChange={(e: any) => setItemPrice(e.target.value)}
                            mt={4}
                        />
                        <input
                          type="file"
                          name="Asset"
                          className="mr-2"
                          onChange={handleImageUpload}
                        />
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
