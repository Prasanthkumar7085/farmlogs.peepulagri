import './global.css';
import SideBarMenu from "@/components/SideBar/SideBarMenu";

function MyApp({
    Component,
    pageProps,
    ...rest
}: any) {

    return (
        <SideBarMenu>
            <Component {...pageProps} />
        </SideBarMenu>
    )
}

export default MyApp;