
export const handleWithdraw = async (factoryContract: any) => {
  await factoryContract.withdraw();
};

export const handleDelete = async (factoryContract: any, deleteId: number) => {
  await factoryContract.deleteShop(deleteId);
};

export const handleSelfDestruct = async (factoryContract: any) => {
  await factoryContract.selfDestruct();
};
