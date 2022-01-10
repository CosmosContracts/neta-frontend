import { Alert, AlertTitle, Button, CircularProgress, Grid, Link, Stack, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { useState } from "react";
import Layout from "../components/layout"
import { connectKeplr } from "../utils/keplr"
import LoadingButton from '@mui/lab/LoadingButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const IndexPage = () => {

  const [claiming, setClaiming] = useState(false)
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const claim = async () => {
    try {
      setError(null)
      setSuccess(null)

      setClaiming(true)

      const [signingClient, accounts] = await connectKeplr({
        name: "Dimi Testnet",
        chain_id: "dimi-test",
        lcd: "http://127.0.0.1:1317",
        rpc: "http://127.0.0.1:26657",
        coinDenom: "JUNO",
        coinMinimalDenom: "ujunox",
        prefix: "juno",
        version: "stargate",
        decimals: 6,
        group: "mainnet",
        features: ["stargate", 'ibc-transfer', 'cosmwasm', 'no-legacy-stdTx', 'ibc-go'],
        gasPriceStep: {
          low: 0.0,
          average: 0.01,
          high: 0.025
        }
      })

      // import data
      const proofs = require(`../data/proofs.json`)

      var claimData = proofs.find((el) => el.address === accounts[0].address);

      if (!claimData) {
        throw Error("This adddress is not eligible. Try connecting another address from Keplr")
      }

      // Format message
      const msg = {
        claim: {
          amount: claimData.amount.toString(),
          proof: claimData.proof,
          stage: 1,
        },
      }

      const data = await signingClient.execute(
        accounts[0].address,
        "juno1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrq68ev2p", 
        msg, 
        { 
          gas: "250000", 
          amount: [{ denom: "ujunox", amount: "0" }] 
        }
      )
      console.log(data)

      if (data.logs.length > 0) {
        setSuccess({
          message: `Successfully claimed ${claimData.amount / 1000000} NETA`, 
          amount: claimData.amount, 
          hash: data.transactionHash
        })
      } else {
        throw Error("Unkown error")
      }

      setClaiming(false)

    } catch (error) {
      console.error(error.message)

      if (error.message.includes("begins at scheduled time")) {
        setError("Claiming window not yet started")
      } else {
        setError(error.message)
      }
      setClaiming(false)
    }
  }

  return (
    <Layout>
      <Box>
        <Typography align="center" variant="h2" component="h1" mt={5}>NETA Money</Typography>
        <Typography align="center" variant="h3" component="h2" mb={5}>Decentralized Store of Value</Typography>

        {error && 
        <Alert severity="error" >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>}
        
        {success && 
          <Alert severity="success" action={
            <Button component={Link} startIcon={<OpenInNewIcon />} href={`https://mintscan.io/juno/txs/${success.hash}`} target="_blank"  size="small" color="success">
              See on Explorer
            </Button>
            }>
          <AlertTitle>Success</AlertTitle>
          {success.message} 
        </Alert>}

        <Typography variant="body1" align="center" mt={5}>
          To claim the airdrop you must sign a message using Keplr. Press the button below when ready.
        </Typography>

        <Typography variant="body1" align="center" mt={5}>
          <LoadingButton variant="outlined" size="large" color="neutral" onClick={claim} loading={claiming} >
            Connect Wallet and Claim
          </LoadingButton>
        </Typography>

      </Box>
    </Layout>
  )
}

export default IndexPage
