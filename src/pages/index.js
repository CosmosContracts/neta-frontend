import {
  Box,
  Alert,
  AlertTitle,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import { connectKeplr } from "../utils/keplr";
import LoadingButton from "@mui/lab/LoadingButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

import logo from "../images/logo.png";

import ClaimCard from "../components/card";

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
      <Box py={{ xs: 4, md: 8 }}>
        <Box
          textAlign="center"
          marginBottom={{ xs: 4, sm: 10 }}
          sx={{
            pointerEvents: "none",
            fontSize: 0,
            "@media (max-width:599px)": {
              img: {
                width: "80px",
              },
            },
          }}
        >
          <img src={logo} width={160} />
        </Box>
        <Grid container spacing={{ xs: 2, md: 5.25 }}>
          <Grid item xs={12} md={8}>
            <Box mb={4} textAlign={{ xs: "center", md: "left" }}>
              <Typography variant="h1">NETA Money</Typography>
              <Typography variant="h3">Decentralized Store of Value</Typography>
            </Box>
            {!success && (
              <Box textAlign={{ xs: "center", md: "left" }}>
                <Typography variant="subtitle1" mb={4}>
                  To claim the airdrop you must sign a message using Keplr.{" "}
                  <br />
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
              </Box>
            )}

            <Box my={4}>
              {error && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {error}
                </Alert>
              )}

              {success && (
                <Card
                  sx={{
                    borderRadius: "16px",
                    maxWidth: "480px",
                    boxShadow: "0px 30px 40px rgba(212, 217, 232, 0.2)",
                  }}
                >
                  <CardContent sx={{ padding: "40px 40px 0 40px" }}>
                    <Typography variant="h3" mb={4}>
                      Congratulations!
                    </Typography>
                    <Typography variant="subtitle1" mb={4}>
                      {success.message}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ padding: "10px 40px 40px 40px" }}>
                    <Button
                      component={Link}
                      startIcon={<OpenInNewIcon />}
                      href={`https://mintscan.io/juno/txs/${success.hash}`}
                      target="_blank"
                      size="large"
                      color="neutral"
                      sx={{
                        padding: 0,
                        textTransform: "uppercase",
                        fontWeight: "normal",
                      }}
                    >
                      See on Explorer
                    </Button>
                  </CardActions>
                </Card>
              )}
            </Box>
          </Grid>
          <Grid xs={12} item md={4}>
            {/* TODO: add proper time and claimingGoal */}
            <ClaimCard
              dateEnd={1642982400000}
              totalClaimed={totalClaimed}
              claimingGoal={32950}
            />
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default IndexPage;
