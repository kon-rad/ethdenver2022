import React, { useContext, useEffect, useState, createContext } from "react";

const AppContext = createContext(undefined);

const AppStateProvider = ({ children }: any) => {
    const [cart, setCart] = useState<any>([]);
    const [cartMetaData, setCartMetaData] = useState<any>({});
    const [cartShopAddress, setCartShopAddress] = useState<string>("");

    const appState = {
        cart,
        setCart,
        cartMetaData,
        setCartMetaData,
        cartShopAddress,
        setCartShopAddress,
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