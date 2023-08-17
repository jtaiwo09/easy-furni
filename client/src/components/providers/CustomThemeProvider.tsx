"use client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import React from "react";
import createTheme from "@mui/material/styles/createTheme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import NoInternet from "../Layout/NoInternet";

declare module "@mui/material/styles" {
  interface Palette {
    custom: Palette["primary"];
  }

  interface PaletteOptions {
    custom: PaletteOptions["primary"];
  }
}

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "rgba(32,32,32,1)",
    },
    secondary: {
      light: "#0066ff",
      main: "#0044ff",
      contrastText: "#ffcc00",
    },
    custom: {
      light: "#ffa726",
      main: "#f57c00",
      dark: "#ef6c00",
      contrastText: "rgba(0, 0, 0, 0.87)",
    },
    contrastThreshold: 4.5,
    tonalOffset: 0.2,
  },
});

interface IProps {
  children: React.ReactNode;
}

function CustomThemeProvider({ children }: IProps) {
  const isOnline = window.navigator.onLine;
  if (!isOnline) return <NoInternet />;

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </ThemeProvider>
    </Provider>
  );
}

export default CustomThemeProvider;
// export default wrapper.withRedux(CustomThemeProvider);
