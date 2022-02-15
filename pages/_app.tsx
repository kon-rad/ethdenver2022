import '../styles/globals.css'
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { Web3ReactProvider } from '@web3-react/core'
import type { AppProps } from 'next/app'
import { getProvider } from '../utils/web3';
import Layout from '../components/layout';
import { SEO } from '../components/seo'


const theme = extendTheme({
  colors: {
    brand: {
      100: "#81B29A",
      200: "#FFD82B",
      300: "#FFEE2E",
      400: "#D0C557"
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider  getLibrary={getProvider}>
      <ChakraProvider theme={theme}>
        <SEO />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Web3ReactProvider>
  )
}

export default MyApp
