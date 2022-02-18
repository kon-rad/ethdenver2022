import { BigNumber } from "bignumber.js";

const getCartQty = (cart) => {
    return cart.reduce((prev: number, item: any) => item.qty + prev, 0);
}

const getCartTotal = (cart: any, cartMetaData: any): any => {
    console.log(cart, cartMetaData);
    return cart.reduce((prev: any, item: any) => prev.plus(cartMetaData[item.itemId].price.multipliedBy(item.qty)), new BigNumber(0));
}

export { getCartQty, getCartTotal };