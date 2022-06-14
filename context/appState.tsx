import React, { useContext, useEffect, useState, createContext } from "react";

const AppContext = createContext(undefined);

const AppStateProvider = ({ children }: any) => {
    const [cart, setCart] = useState<any>([]);
    const [cartMetaData, setCartMetaData] = useState<any>({});
    const [catalogItems, setCatalogItems] = useState<any>({});
    const [cartShopAddress, setCartShopAddress] = useState<string>("");
    const [affiliate, setAffiliate] = useState<string>("");

    const appState = {
        cart,
        setCart,
        cartMetaData,
        setCartMetaData,
        catalogItems,
        setCatalogItems,
        cartShopAddress,
        setCartShopAddress,
        affiliate,
        setAffiliate
    }
    return (
        <AppContext.Provider value={appState}>
            {children}
        </AppContext.Provider>
    )
}

const useAppState = () => {
    return useContext(AppContext);
}

export {
    useAppState,
    AppStateProvider
}