import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";
import Helmet from "react-helmet";

import Footer from "./footer";
import Background from "./background";

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Background />
      <Container>
        <CssBaseline />
        {children}
      </Container>
      <Footer />
    </ThemeProvider>
  );
}
