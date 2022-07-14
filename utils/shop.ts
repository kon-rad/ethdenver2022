import { ethers } from "ethers";
import { toast } from "react-toastify";
import { formatAddress } from '../utils/web3';

export const getAffiliates = async (
  provider: any,
  setProposedAffiliates: any,
  setActiveAffiliates: any,
  shopAbi: any,
  shopAddress: any,
) => {
  console.log("getAffiliates is called", shopAddress);

  const factoryContract = new ethers.Contract(
    shopAddress,
    shopAbi,
    provider
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

export const updateAffiliate = async (affAddr: string, provider: any, shopAddress: any, shopAbi: any, isApproved: boolean) => {
    const signer = provider.getSigner();
  
    const shopContract = new ethers.Contract(shopAddress, shopAbi, signer);
    if (isApproved) {
        await shopContract.cancelAffiliate(affAddr);

        toast(`You successfully cancelled affiliate ${formatAddress(affAddr)}!`, {
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

      toast(`You successfully approved affiliate ${formatAddress(affAddr)}!`, {
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

const ERROR_MESSAGES = {
  'PA0': 'Sender is an affiliate already',
  'PA1': 'Percentage must be greater than zero',
  'PA2': 'Percentage must be less than 100',
  'MT0': 'Affiliate must be approved',
  'MT1': 'Required value not met',
  'GR0': 'Sender is not client',
  'OO0': 'Only owner function',
  'OG0': 'Only governor function',
  'CI0': 'Must be fewer than 100 items',
  'CS0': 'Shop price not met',
}