import React from "react";
import MuiBox from "@mui/material/Box";
import { Container, Box, Grid, Typography, Link } from "@mui/material";

import logo from "../images/logo-small.png";

import discord from "../images/discord.svg";
import github from "../images/github.svg";
import reddit from "../images/reddit.svg";
import twitter from "../images/twitter.svg";

export default function Footer({ children }) {
  return (
    <Box
      sx={{
        backgroundColor: "#111",
        position: "absolute",
        bottom: 0,
        width: "100%",
        left: 0,
      }}
      py={3}
    >
      <Container>
        <Grid container spacing={1} alignItems="center">
          <Grid item sm={8}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={logo} width={30} />
              <Typography color="white" variant="subtitle2">
                NETA Money - Decentralize Store of Value.
              </Typography>
            </Box>
          </Grid>
          <Grid item sm={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: 0,
              }}
              justifyContent={{ xs: "flex-end" }}
            >
              <Link href="#" p={0.4}>
                <img src={twitter} width={24} />
              </Link>
              <Link href="#" p={0.4}>
                <img src={discord} width={24} />
              </Link>
              <Link href="#" p={0.4}>
                <img src={reddit} width={24} />
              </Link>
              <Link href="#" p={0.4}>
                <img src={github} width={24} />
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
