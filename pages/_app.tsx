import { AppProps } from "next/app";

function MyApp({
    Component,
    pageProps,
    ...rest
}: AppProps) {

    return (
        <Component {...pageProps} />
    )
}

export default MyApp;