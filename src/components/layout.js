import React from "react"
import { ThemeProvider } from '@mui/material/styles';
import theme from "../theme"
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
        <Container>
            <CssBaseline />
            {children}
        </Container>
    </ThemeProvider>
  )
}