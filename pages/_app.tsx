import { wrapper } from "@/Redux";
import SideBarMenu from "@/components/SideBar/SideBarMenu";
import theme from "@/themes/themes";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import "./global.css";
import ScoutingHeader from "@/components/Scouting/NavBar/NavbarComponent";

function MyApp({ Component, pageProps, ...rest }: any) {
  const { store, props } = wrapper.useWrappedStore(rest);

  const router = useRouter();

  const sideBarList = [
    "/",
    "/signup",
    "/signup-verify",
    "/forgot-password",
    "/forgot-password/reset-password",

  ];
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        {router.pathname.includes("farms") || router.pathname.includes("users-tasks") || router.pathname.includes("users-procurements") || router.pathname.includes("dashboard") || router.pathname.includes("summary") || router.pathname.includes("/farms/markers") || router.pathname.includes("profile/user") || router.pathname.includes("profile/update-password") || router.pathname.includes("add-stream-urls") || router.pathname.includes("/live-streaming") ? (
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
