import { ethers } from "ethers";
import { toast } from "react-toastify";

export const getAffiliates = async (
  web3React: any,
  setProposedAffiliates: any,
  setActiveAffiliates: any,
  shopAbi: any,
  shopAddress: string,
) => {
    console.log("getAffiliates is called");
  const provider = web3React.library;
  const signer = provider.getSigner();

  const factoryContract = new ethers.Contract(
    shopAddress,
    shopAbi,
    signer
  );

  const proposed = await factoryContract.getProposedAffiliates();
  const active = await factoryContract.getApprovedAffiliates();
  console.log("getAffiliates results: ", proposed, active);
  setProposedAffiliates(proposed);
  setActiveAffiliates(active);
};

export const makeAffiliateProposal = async (
  provider: any,
  shopAddress: any,
  shopAbi: any,
  percentage: string
) => {
  const signer = provider.getSigner();

  const shopContract = new ethers.Contract(shopAddress, shopAbi, signer);
  await shopContract.proposeAffiliate(percentage);

  toast(`You successfully proposed affiliate status for ${percentage}%!`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const updateAffiliate = async (affAddr: string, provider: any, shopAddress: string, shopAbi: any, isApproved: boolean) => {
    const signer = provider.getSigner();
  
    const shopContract = new ethers.Contract(shopAddress, shopAbi, signer);
    if (isApproved) {
        await shopContract.cancelAffiliate(affAddr);

        toast(`You successfully cancelled affiliate ${affAddr}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    } else {
        await shopContract.approveAffiliate(affAddr);

      toast(`You successfully approved affiliate ${affAddr}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
}