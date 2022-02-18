const getCartQty = (cart) => {
    return cart.reduce((prev: number, item: any) => item.qty + prev, 0);
}

const getCartTotal = (cart, cartMetaData) => {
    console.log(cart, cartMetaData);
    return cart.reduce((prev: number, item: any) => prev += (item.qty * (cartMetaData[item.itemId] ? cartMetaData[item.itemId].price : 0)), 0);
}

export { getCartQty, getCartTotal };