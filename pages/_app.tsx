import '../styles/globals.css'
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { Web3ReactProvider } from '@web3-react/core'
import type { AppProps } from 'next/app'
import { getProvider } from '../utils/web3';
import Layout from '../components/layout';
import { SEO } from '../components/seo'
import "../styles/Home.module.css";
import { Web3Provider, ExternalProvider } from '@ethersproject/providers';
// import { SupportedChainContextProvider } from './contexts/supportedChain';



// /* CSS HEX */
// --persian-blue: #072ac8ff;
// --dodger-blue: #1e96fcff;
// --uranian-blue: #a2d6f9ff;
// --cadmium-yellow: #fcf300ff;
// --mikado-yellow: #ffc600ff;

const theme = extendTheme({
  config: {
    useSystemColorMode: true,
    initialColorMode: "dark"
  },
  colors: {
    brand: {
      100: "#072ac8ff",
      200: "#1e96fcff",
      300: "#a2d6f9ff",
      400: "#fcf300ff",
      500: "#ffc600ff"
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider  getLibrary={getProvider}>
      {/* <SupportedChainContextProvider> */}
      <ChakraProvider theme={theme}>
        <SEO />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
      {/* </SupportedChainContextProvider> */}
    </Web3ReactProvider>
  )
}

export default MyApp
