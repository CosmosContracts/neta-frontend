import { red } from "@mui/material/colors";
import { createTheme, theme as materialTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
      fontSize: "42px",
      lineHeight: "54px",
      "@media (min-width:600px)": {
        fontSize: "72px",
        lineHeight: "87px",
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: "36px",
      lineHeight: "44px",
      "@media (min-width:600px)": {
        fontSize: "48px",
        lineHeight: "64px",
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: "28px",
      lineHeight: "32px",
      "@media (min-width:600px)": {
        fontSize: "36px",
        lineHeight: "44px",
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: "20px",
      lineHeight: "33px",
      "@media (min-width:600px)": {
        fontSize: "26px",
        lineHeight: "38px",
      },
    },
    h5: {
      fontWeight: 700,
      fontSize: "16px",
      lineHeight: "26px",
    },
    subtitle1: {
      fontWeight: 700,
      fontSize: "16px",
      lineHeight: "22px",
      "@media (min-width:600px)": {
        fontSize: "24px",
        lineHeight: "32px",
      },
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: "11px",
      lineHeight: "20px",
      "@media (min-width:600px)": {
        fontSize: "14px",
        lineHeight: "24px",
      },
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#F0827D",
    },
    neutral: {
      main: "#949494",
      contrastText: "#949494",
    },
  },
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#fff",
          borderBottomWidth: "2px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          boxShadow: "0px 30px 40px rgba(212, 217, 232, 0.2)",

          "&:hover": {
            boxShadow: "0px 30px 40px rgba(212, 217, 232, 0.2)",
          },
        },
        containedPrimary: {
          color: "#fff",

          "&:hover": {
            backgroundColor: "#f0827db8",
          },
        },
        sizeLarge: {
          padding: "12px 32px",
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "24px",
        },
      },
      MuiLoadingButton: {
        root: {},
      },
    },
  },
});

export default theme;
