import { ChakraProvider } from "@chakra-ui/react";
import "../styles/global.css";
import theme from "../theme";
import { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider resetCSS theme={theme}>
            <Head>
                <title>Deso Bets</title>
            </Head>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default MyApp;
