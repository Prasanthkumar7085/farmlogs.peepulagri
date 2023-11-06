import { wrapper } from "@/Redux";
import ScoutingHeader from "@/components/Scouting/NavBar/NavbarComponent";
import SideBarMenu from "@/components/SideBar/SideBarMenu";
import theme from "@/themes/themes";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import "./global.css";
import NextTopLoader from "nextjs-toploader";


function MyApp({ Component, pageProps, ...rest }: any) {
  const { store, props } = wrapper.useWrappedStore(rest);

  const router = useRouter();

  const sideBarList = ["/", "/signup", "/signup-verify",
    "/forgot-password",
    "/forgot-password/reset-password"];
  return (
    <ThemeProvider theme={theme}>
      <NextTopLoader />
      <Provider store={store}>
        {router.pathname.includes("farms") ? (
          <ScoutingHeader>
            <Component {...pageProps} />
          </ScoutingHeader>
        ) : sideBarList.includes(router.pathname) ? (
          <Component {...pageProps} />
        ) : router.pathname == "/mobile-redirect" ? (
          <Component {...pageProps} />
        ) : (
          <SideBarMenu>
            <Component {...pageProps} />
          </SideBarMenu>
        )}
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;
