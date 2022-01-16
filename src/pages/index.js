import {
  Box,
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  CardContent,
  Grid,
  Link,
  Stack,
  Typography,
  Divider,
  Card,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import { connectKeplr } from "../utils/keplr";
import LoadingButton from "@mui/lab/LoadingButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import logo from "../images/logo.png";

const IndexPage = () => {
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalClaimed, setTotalClaimed] = useState(0);

  // on load
  useEffect(() => {
    async function load() {
      try {
        var client = await CosmWasmClient.connect(process.env.GATSBY_CHAIN_RPC);
        var data = await client.queryContractSmart(
          process.env.GATSBY_CONTRACT_ADDRESS,
          { total_claimed: { stage: 1 } }
        );

        if (data.total_claimed > 0) {
          setTotalClaimed(data.total_claimed / 1000000);
        }
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  const claim = async () => {
    try {
      setError(null);
      setSuccess(null);

      setClaiming(true);

      const [signingClient, accounts] = await connectKeplr({
        name: process.env.GATSBY_CHAIN_NAME,
        chain_id: process.env.GATSBY_CHAIN_ID,
        lcd: process.env.GATSBY_CHAIN_LCD,
        rpc: process.env.GATSBY_CHAIN_RPC,
        coinDenom: process.env.GATSBY_COIN_DENOM,
        coinMinimalDenom: process.env.GATSBY_COIN_MIN_DENOM,
        prefix: "juno",
        version: "stargate",
        decimals: 6,
        features: [
          "stargate",
          "ibc-transfer",
          "cosmwasm",
          "no-legacy-stdTx",
          "ibc-go",
        ],
        gasPriceStep: {
          low: 0.0,
          average: 0.01,
          high: 0.1,
        },
      });

      // import data
      const proofs = require(`../data/proofs.json`);

      var claimData = proofs.find((el) => el.address === accounts[0].address);

      if (!claimData) {
        throw Error(
          "This adddress is not eligible. Try connecting another address from Keplr"
        );
      }

      // Format message
      const msg = {
        claim: {
          amount: claimData.amount.toString(),
          proof: claimData.proof,
          stage: 1,
        },
      };

      const data = await signingClient.execute(
        accounts[0].address,
        process.env.GATSBY_CONTRACT_ADDRESS,
        msg,
        {
          gas: "250000",
          amount: [{ denom: "ujunox", amount: "250000" }],
        }
      );
      console.log(data);

      if (data.logs.length > 0) {
        setSuccess({
          message: `Successfully claimed ${
            claimData.amount / 1000000
          } Test NETA`,
          amount: claimData.amount,
          hash: data.transactionHash,
        });
      } else {
        throw Error("Unkown error");
      }

      setClaiming(false);
    } catch (error) {
      console.error(error.message);

      if (error.message.includes("begins at scheduled time")) {
        setError("Claiming window not yet started");
      } else {
        setError(error.message);
      }
      setClaiming(false);
    }
  };

  return (
    <Layout>
      <Box py={8}>
        <Box
          textAlign="center"
          marginBottom={10}
          sx={{ pointerEvents: "none", fontSize: 0 }}
        >
          <img src={logo} width={160} />
        </Box>
        <Grid container spacing={5.25}>
          <Grid item sm={8}>
            <Box mb={4}>
              <Typography variant="h1">NETA Money</Typography>
              <Typography variant="h3">Decentralized Store of Value</Typography>
            </Box>
            <Typography variant="subtitle1" mb={4}>
              To claim the airdrop you must sign a message using Keplr. <br />
              Press the button below when ready.
            </Typography>
            <LoadingButton
              variant="contained"
              size="large"
              color="primary"
              onClick={claim}
              loading={claiming}
            >
              Connect Wallet and Claim
            </LoadingButton>
          </Grid>
          <Grid item sm={4}>
            <Card
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "24px",
              }}
            >
              <Box py={7.5} px={5}>
                <Typography
                  variant="h5"
                  mb={3}
                  sx={{ textTransform: "uppercase" }}
                >
                  Total claimed so far:
                </Typography>
                <Typography variant="h2" color="primary.main">
                  {totalClaimed}
                </Typography>
                <Typography variant="h5" color="primary.main">
                  Test NETA
                </Typography>
                <Box mt={2} mb={5.25}>
                  <Divider />
                </Box>
                <Typography variant="h5">
                  until{" "}
                  <Typography
                    variant="h5"
                    component="span"
                    color="primary.main"
                    px={0.5}
                  >
                    2938849 NETA
                  </Typography>{" "}
                  will be burn
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <Box>
          {error && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              action={
                <Button
                  component={Link}
                  startIcon={<OpenInNewIcon />}
                  href={`https://mintscan.io/juno/txs/${success.hash}`}
                  target="_blank"
                  size="small"
                  color="success"
                >
                  See on Explorer
                </Button>
              }
            >
              <AlertTitle>Success</AlertTitle>
              {success.message}
            </Alert>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default IndexPage;
