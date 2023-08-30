import { ThemeProvider } from '@mui/material/styles';
import theme from '@/themes/themes';
import SideBarMenu from "@/components/SideBar/SideBarMenu";
import './global.css';
import { useRouter } from 'next/router';

function MyApp({
    Component,
    pageProps,
    ...rest
}: any) {

    const router = useRouter();
    return (
        <ThemeProvider theme={theme}>
            {router.pathname == '/' ?
                <Component {...pageProps} /> :
                <SideBarMenu>
                    <Component {...pageProps} />
                </SideBarMenu>}
        </ThemeProvider>
    )
}


export default MyApp;