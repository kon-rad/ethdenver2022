import web3 from "web3";
import { ethers } from "ethers";
import ShopFactory from "../artifacts/contracts/ShopFactory.sol/ShopFactory.json";
import { toast } from "react-toastify";

export const handleWithdraw = async (web3React: any) => {
  const provider = web3React.library;
  const signer = provider.getSigner();

  const factoryContract = new ethers.Contract(
    process.env.NEXT_PUBLI_FACTORY_ADDRESS,
    ShopFactory.abi,
    signer
  );
  await factoryContract.withdraw();
};

export const handleDelete = async (web3React: any, deleteId: string) => {
  const provider = web3React.library;
  const signer = provider.getSigner();

  const factoryContract = new ethers.Contract(
    process.env.NEXT_PUBLI_FACTORY_ADDRESS,
    ShopFactory.abi,
    signer
  );
  await factoryContract.deleteShop(deleteId);
};

export const handleSelfDestruct = async (web3React: any) => {
  const provider = web3React.library;
  const signer = provider.getSigner();

  const factoryContract = new ethers.Contract(
    process.env.NEXT_PUBLI_FACTORY_ADDRESS,
    ShopFactory.abi,
    signer
  );
  await factoryContract.selfDestruct();
};

export const fetchShops = async (
  web3React: any,
  setShops: any,
  setBalance: any
) => {
  const provider = web3React.library;

  console.log("process.env.NEXT_PUBLIC_FACTORY_ADDRESS: ", process.env.NEXT_PUBLIC_FACTORY_ADDRESS);
  if (!provider) {
    toast.error(`You must sign in to metamask!`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    return;
  }
  // console.log('network: ', process.env.NEXT_PUBLIC_NETWORK);
  // const provider = ethers.getDefaultProvider(process.env.NEXT_PUBLIC_NETWORK);
  const factoryContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
    ShopFactory.abi,
    provider
  );

  const data = await factoryContract.fetchAllShops();
  const balance = await factoryContract.getBalance();
  console.log("data: ", data);
  setShops(data);
  setBalance(web3.utils.fromWei(balance.toString(), "ether"));
};
