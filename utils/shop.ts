import { ethers } from "ethers";

export const getAffiliates = async (
  web3React: any,
  setProposedAffiliates: any,
  setActiveAffiliates: any,
  shopAbi: any,
  shopAddress: string,
) => {
  const provider = web3React.library;
  const signer = provider.getSigner();

  const factoryContract = new ethers.Contract(
    shopAddress,
    shopAbi,
    signer
  );

  const proposed = await factoryContract.getProposedAffiliates();
  const active = await factoryContract.getActiveAffiliates();
  console.log("getProposedAffiliates proposed: ", proposed);
  setProposedAffiliates(proposed);
  setActiveAffiliates(active);
};

export const makeAffiliateProposal = async (
  provider: any,
  shopAddress: any,
  shopAbi: any,
  percentage: string
) => {
  console.log("makeAffiliateProposal");
  const signer = provider.getSigner();

  const shopContract = new ethers.Contract(shopAddress, shopAbi, signer);
  await shopContract.proposeAffiliate(percentage);
};

export const updateAffiliate = async (affAddr: string, provider: any, shopAddress: string, shopAbi: any, isApproved: boolean) => {
    console.log("approveAffiliate");
    const signer = provider.getSigner();
  
    const shopContract = new ethers.Contract(shopAddress, shopAbi, signer);
    if (isApproved) {
        await shopContract.cancelAffiliate(affAddr);
    } else {
        await shopContract.approveAffiliate(affAddr);
    }
}