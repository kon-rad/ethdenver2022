import "../styles/globals.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import { getProvider } from "../utils/web3";
import Layout from "../components/layout";
import { SEO } from "../components/seo";
import "../styles/Home.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Web3Provider, ExternalProvider } from "@ethersproject/providers";
import { AppStateProvider } from "../context/appState";
import { AuthProvider } from "../context/auth";

// /* CSS HEX */
// https://coolors.co/202a25-5f4bb6-86a5d9-26f0f1-c4ebc8
// --dark-jungle-green: #202a25ff;
// --plump-purple: #5f4bb6ff;
// --little-boy-blue: #86a5d9ff;
// --fluorescent-blue: #26f0f1ff;
// --tea-green: #c4ebc8ff;

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark",
  },
  colors: {
    brand: {
      100: "#202a25ff",
      200: "#5f4bb6ff",
      300: "#86a5d9ff",
      400: "#26f0f1ff",
      500: "#c4ebc8ff",
      600: "#ea3546", // red
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getProvider}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <AppStateProvider>
          <SEO />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          </AppStateProvider>
        </AuthProvider>
      </ChakraProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
