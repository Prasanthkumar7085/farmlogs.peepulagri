import { ThemeProvider } from '@mui/material/styles';
import theme from '@/themes/themes';
import SideBarMenu from "@/components/SideBar/SideBarMenu";
import './global.css';
import { useRouter } from 'next/router';
import { wrapper } from "@/Redux";
import { Provider } from "react-redux";

function MyApp({
    Component,
    pageProps,
    ...rest
}: any) {

    const { store, props } = wrapper.useWrappedStore(rest);

    const router = useRouter();
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
            {router.pathname == '/' ?
                <Component {...pageProps} /> :
                <SideBarMenu>
                    <Component {...pageProps} />
                </SideBarMenu>}
            </Provider>
        </ThemeProvider>
    )
}


export default MyApp;