import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3462cf",
      light: "#4b77de",
      dark: "#2143a2",
    },
    secondary: {
      main: "#f50057",
    },
    success: {
      main: "#05a155",
      light: "#0acb6e",
      dark: "#048343",
    },
  },
});
export default theme;
