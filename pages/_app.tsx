import { ThemeProvider } from '@mui/material/styles';
import theme from '@/themes/themes';
import SideBarMenu from "@/components/SideBar/SideBarMenu";
import './global.css';

function MyApp({
    Component,
    pageProps,
    ...rest
}: any) {

    return (
        <ThemeProvider theme={theme}>
            <SideBarMenu>
                <Component {...pageProps} />
            </SideBarMenu>
        </ThemeProvider>
    )
}


export default MyApp;