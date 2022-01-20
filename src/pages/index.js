import { Alert, AlertTitle, Button, CircularProgress, Grid, Link, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import { connectKeplr } from "../utils/keplr";
import LoadingButton from '@mui/lab/LoadingButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import DateCountdown from 'react-date-countdown-timer';

import leftBlob from '../images/left.png';
import rightBlob from '../images/right.png';
import netaHeader from '../images/header.png';
import heroDivide from '../images/heroDivide.png';
import checkMark from '../images/checkmark.png';
import errorSign from '../images/errorSign.png';
import netaCoin from '../images/netaCoin.png';
import claimedLogo from '../images/claimedLogo.png';

const IndexPage = () => {

  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [totalClaimed, setTotalClaimed] = useState(0);
  const [totalToBurn, setTotalToBurn] = useState(0);


  // on load
  useEffect(() => {
    async function load() {
      try {
        var client = await CosmWasmClient.connect(process.env.GATSBY_CHAIN_RPC);
        var data = await client.queryContractSmart(process.env.GATSBY_CONTRACT_ADDRESS, { total_claimed: { stage: 1 } });

        if (data.total_claimed > 0) {
          setTotalClaimed(data.total_claimed / 1000000);
          setTotalToBurn(32950-data.total_claimed/1000000);
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
        features: ["stargate", 'ibc-transfer', 'cosmwasm', 'no-legacy-stdTx', 'ibc-go'],
        gasPriceStep: {
          low: 0.0,
          average: 0.01,
          high: 0.1
        }
      });

      // import data
      const proofs = require(`../data/proofs.json`);

      var claimData = proofs.find((el) => el.address === accounts[0].address);

      if (!claimData) {
        throw Error("This address is not eligible. Try connecting another address from Keplr");
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
          amount: [{ denom: "ujunox", amount: "250000" }]
        }
      );
      console.log(data);

      if (data.logs.length > 0) {
        setError(null);
        setSuccess({
          message: `Successfully claimed ${claimData.amount / 1000000} NETA`,
          amount: claimData.amount,
          hash: data.transactionHash
        });
      } else {
        throw Error("Unknown error");
      }

      setClaiming(false);

    } catch (error) {
      console.error(error.message);

      if (error.message.includes("begins at scheduled time")) {
        setError("Claiming window has not yet started");
      } else {
        setError(error.message);
      }
      setClaiming(false);
    }
  };
  
  if (typeof window !== `undefined`) {
    DateCountdown.defaultProps = {
      locales: ['y :', 'm :', 'd :', 'h :', 'm :', 's'],
      locales_plural: ['y :', 'm :', 'd :', 'h :', 'm :', 's'],
      dateTo: (new Date()).toString(),
      dateFrom: (new Date()).toString(),
      callback: () => alert("Time's Up"),
      mostSignificantFigure: 'd',
      numberOfFigures: 6,
      noAnimate: false,
    };
  } else {
    console.log("Window is undefined");
  };

  return (
    <Layout>
      <div className="font-body flex flex-col min-h-screen w-screen overflow-hidden text-white">
        <img src={leftBlob} alt="" draggable="false"
          class="hidden md:block fixed top-0 left-0" />
        <img src={rightBlob} alt="" draggable="false"
          class="hidden md:block fixed right-0 items-center mt-64" />

        <div className="mx-auto mt-10 w-full">
          <img src={netaHeader} alt="NETA" draggable="false" className="mx-auto w-3/5 md:w-fit" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-12 gap-2 mt-10 mb-20 lg:mt-16 lg:mb-48">


          <div className="hidden 2xl:block 3xl:col-span-2"></div>


          <div className="2xl:col-span-5 mx-3 xl:mx-0 xl:ml-16 2xl:ml-0 text-center lg:text-left">
            <div className="space-y-6 mb-10">
              <div className="text-3xl md:text-4xl 2xl:text-5xl font-bold tracking-wide">
                <p><span className="bg-gradient-to-r from-primaryLight to-primaryDark bg-clip-text text-transparent">NETA</span> Money</p>
                <p>Airdrop Verifier</p>
              </div>
              <h2 className="text-xl md:text-2xl 2xl:text-3xl font-medium tracking-wide">Decentralized Store of Value</h2>
            </div>
            <img src={heroDivide} alt="." draggable="false" className="mx-auto lg:mx-0" />
            <div className="mt-10 space-y-10 px-3 lg:px-0">
              <div className="text-altText font-semibold text-lg md:text-xl 2xl:text-2xl space-y-4">
                <p>NETA is claimable starting from February 1st, 2022.</p>
                <p>All unclaimed NETA will automatically be permanently burned on February 28th, 2022.</p>
              </div>
              <div>
                <p className="text-altText font-semibold text-base 2xl:text-lg">To claim the airdrop, press the button below to connect your Keplr wallet.</p>
                <div className="pt-8 lg:pt-5 space-y-4">
                  <div className="flex lg:flex-row flex-col space-y-4 lg:space-y-0 space-x-0 lg:space-x-4 justify-start items-center">
                    <button onClick={claim} loading={claiming} className="gradient text-shadow py-3 px-5 min-w-[17rem] flex justify-between rounded-full font-bold mx-auto lg:mx-0" >
                      Connect Wallet & Claim
                      <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.84214 9.84465C2.53597 9.88843 2.29999 10.1651 2.29999 10.4998C2.29999 10.865 2.58083 11.161 2.92726 11.161H13.9533L9.97025 15.3424L9.90937 15.4165C9.72666 15.6749 9.74618 16.0423 9.96842 16.2775C10.2129 16.5362 10.61 16.5371 10.8555 16.2794L15.9066 10.9773C15.9367 10.9469 15.9639 10.9134 15.9878 10.8773C16.1587 10.6191 16.1346 10.2609 15.9155 10.0309L10.8555 4.72031L10.785 4.65645C10.539 4.46496 10.1906 4.48709 9.96838 4.72233C9.72394 4.98109 9.7248 5.39972 9.97029 5.65737L13.9543 9.83862H2.92726L2.84214 9.84465Z" fill="white" />
                      </svg>
                    </button>

                    {error &&
                      <div className="block bg-[#353131] text-shadow py-1 px-1 mx-auto rounded-full lg:mx-0" >
                        <div className="bg-[#201D1D] text-shadow py-2 px-4 max-w-xs md:max-w-xs xl:max-w-[27rem] 2xl:max-w-xl 3xl:max-w-xl flex space-x-3 justify-between items-center rounded-full font-bold mx-auto lg:mx-0">
                          <p className="break-words w-11/12">{error}</p>

                          <div className="block">
                            <img src={errorSign} />
                          </div>

                        </div>
                      </div>
                    }

                    {success &&
                      <div className="block bg-[#353131] text-shadow py-1 px-1 mx-auto rounded-full lg:mx-0" >
                        <div className="bg-[#201D1D] text-shadow py-2 px-4 max-w-xs md:max-w-xs xl:max-w-[27rem] 2xl:max-w-xl 3xl:max-w-xl flex space-x-3 justify-between items-center rounded-full font-bold mx-auto lg:mx-0">
                          <p className="break-words w-11/12">{success.message}</p>

                          <div className="block">
                            <img src={checkMark} />
                          </div>

                        </div>
                      </div>
                    }


                  </div>

                    <div className="flex lg:flex-row flex-col space-y-4 lg:space-y-0 space-x-0 lg:space-x-4 justify-start items-center">
                      <a href="https://neta.money/NETA_Money.pdf" target="_blank" rel="noopener noreferrer" className="gradient text-shadow py-3 px-5 w-68 flex justify-between rounded-full font-bold mx-auto lg:mx-0">
                        NETA Paper
                        <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.84214 9.84465C2.53597 9.88843 2.29999 10.1651 2.29999 10.4998C2.29999 10.865 2.58083 11.161 2.92726 11.161H13.9533L9.97025 15.3424L9.90937 15.4165C9.72666 15.6749 9.74618 16.0423 9.96842 16.2775C10.2129 16.5362 10.61 16.5371 10.8555 16.2794L15.9066 10.9773C15.9367 10.9469 15.9639 10.9134 15.9878 10.8773C16.1587 10.6191 16.1346 10.2609 15.9155 10.0309L10.8555 4.72031L10.785 4.65645C10.539 4.46496 10.1906 4.48709 9.96838 4.72233C9.72394 4.98109 9.7248 5.39972 9.97029 5.65737L13.9543 9.83862H2.92726L2.84214 9.84465Z" fill="white" />
                        </svg>
                      </a>

                    {success &&
                      <a href={`https://mintscan.io/juno/txs/${success.hash}`} target="_blank" className="block font-bold text-shadow px-5" rel="noopener noreferrer">
                        View on Mintscan
                      </a>
                    }


                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="hidden 2xl:block 3xl:hidden"></div>


          <div className="2xl:col-span-3 text-center mx-auto flex flex-col items-center justify-center -mt-10 lg:-mt-40 px-3 xl:px-0">
            <img src={netaCoin} alt="Picture of NETA Coin" draggable='false' className="mx-auto h-1/4 lg:h-2/5 3xl:h-1/2 xl:-mt-10" />
            <div className="xl:-mt-5 space-y-4">
              <p className="uppercase text-xl 2xl:text-2xl font-bold">
                TOTAL CLAIMED SO FAR
              </p>
              <div className="bg-[#201D1D] border-4 border-[#353131] py-2 px-10 xl:px-16 rounded-full flex justify-center items-center font-bold text-2xl md:text-3xl lg:text-4xl 3xl:text-5xl">
                <p>{totalClaimed}</p><span className="pl-3 bg-gradient-to-r from-primaryLight to-primaryDark text-transparent bg-clip-text">NETA</span><img src={claimedLogo} alt='Logo' className="pl-3 h-12 xl:h-full" />
              </div>
            </div>
            <div className="space-y-3 lg:space-y-5 pt-4 lg:pt-7">
              <div className="tracking-wider text-xl md:text-2xl 3xl:text-3xl font-timer font-extrabold">
                <DateCountdown dateTo='March 01, 2022 00:00:00 UTC+00:00' mostSignificantFigure='day' />
              </div>
              <div className="font-bold text-xl md:text-2xl">
                <p>Until <span className="bg-gradient-to-r from-primaryLight to-primaryDark text-transparent bg-clip-text">{totalToBurn} NETA</span> is burned</p>
              </div>
            </div>
          </div>


          <div className="hidden 2xl:block 3xl:col-span-2"></div>


        </div>


        <div className="flex-1 relative mt-20 md:mt-0">
          <div className="absolute bottom-0">
            <div className="p-5 w-screen bg-[#121212] border-t-4 border-[#272727]">
              <div className="text-center flex flex-col justify-center items-center space-y-2 pt-3 lg:pt-0">
                <p className="text-[#7A7A7A] font-semibold text-sm md:text-base">
                  Copyright 2022 | All Rights Reserved by NETA
                </p>
                <div className="flex space-x-4 pt-3">
                  <a href="https://twitter.com/NetaMoney" target="_blank" rel="noopener noreferrer">
                    <svg className="fill-[#7A7A7A] hover:fill-primary trans" width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.90544 18C4.36365 18 1.99428 17.2636 0 15.9931C1.69321 16.1022 4.68134 15.8409 6.53995 14.0751C3.74399 13.9473 2.48306 11.8114 2.31859 10.8986C2.55616 10.9899 3.68917 11.0994 4.32877 10.8438C1.11249 10.0406 0.619086 7.22921 0.728732 6.3712C1.33178 6.79108 2.35514 6.93712 2.75718 6.90061C-0.239806 4.76471 0.838377 1.55172 1.36833 0.858012C3.51908 3.82591 6.74237 5.49279 10.73 5.58551C10.6548 5.25706 10.6151 4.91511 10.6151 4.56389C10.6151 2.04333 12.6605 0 15.1837 0C16.502 0 17.6899 0.557807 18.5238 1.45005C19.4047 1.24443 20.7305 0.763097 21.3787 0.346856C21.052 1.51521 20.0349 2.48986 19.4196 2.8511C19.4247 2.86339 19.4146 2.83876 19.4196 2.8511C19.9601 2.76968 21.4223 2.48977 22 2.09939C21.7143 2.75576 20.636 3.84709 19.7511 4.45807C19.9157 11.6907 14.3601 18 6.90544 18Z" />
                    </svg>
                  </a>

                  <a href="https://discord.com/invite/bK2YYYvjCQ" target="_blank" rel="noopener noreferrer">
                    <svg className="fill-[#7A7A7A] hover:fill-primary trans" width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.0275 2.21091C19.3761 0.814545 17.3945 0.116364 15.3028 0L14.9725 0.349091C16.844 0.814546 18.4954 1.74545 20.0367 3.02545C18.1651 1.97818 16.0734 1.28 13.8716 1.04727C13.211 0.930909 12.6606 0.930909 12 0.930909C11.3394 0.930909 10.789 0.930909 10.1284 1.04727C7.92661 1.28 5.83486 1.97818 3.9633 3.02545C5.50459 1.74545 7.15596 0.814546 9.02752 0.349091L8.69725 0C6.6055 0.116364 4.62385 0.814545 2.97248 2.21091C1.10092 5.93455 0.110092 10.1236 0 14.4291C1.65138 16.2909 3.9633 17.4545 6.38532 17.4545C6.38532 17.4545 7.15596 16.5236 7.70642 15.7091C6.27523 15.36 4.95413 14.5455 4.07339 13.2655C4.84404 13.7309 5.61468 14.1964 6.38532 14.5455C7.37615 15.0109 8.36697 15.2436 9.3578 15.4764C10.2385 15.5927 11.1193 15.7091 12 15.7091C12.8807 15.7091 13.7615 15.5927 14.6422 15.4764C15.633 15.2436 16.6239 15.0109 17.6147 14.5455C18.3853 14.1964 19.156 13.7309 19.9266 13.2655C19.0459 14.5455 17.7248 15.36 16.2936 15.7091C16.844 16.5236 17.6147 17.4545 17.6147 17.4545C20.0367 17.4545 22.3486 16.2909 24 14.4291C23.8899 10.1236 22.8991 5.93455 21.0275 2.21091ZM8.36697 12.3345C7.26606 12.3345 6.27523 11.2873 6.27523 10.0073C6.27523 8.72727 7.26606 7.68 8.36697 7.68C9.46789 7.68 10.4587 8.72727 10.4587 10.0073C10.4587 11.2873 9.46789 12.3345 8.36697 12.3345ZM15.633 12.3345C14.5321 12.3345 13.5413 11.2873 13.5413 10.0073C13.5413 8.72727 14.5321 7.68 15.633 7.68C16.7339 7.68 17.7248 8.72727 17.7248 10.0073C17.7248 11.2873 16.7339 12.3345 15.633 12.3345Z" />
                    </svg>
                  </a>

                  <a href="https://neta.money/" target="_blank" rel="noopener noreferrer">
                    <svg className="fill-[#7A7A7A] hover:fill-primary trans" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.0961 0.120184C13.8431 0.18028 12.6381 0.727155 11.7067 1.65865L8.05281 5.31249C8.62673 4.73557 10.7571 5.1322 11.274 5.64903L13.4855 3.43749C13.9753 2.94771 14.5883 2.64723 15.2163 2.62018C15.643 2.59915 16.2469 2.68929 16.7788 3.22115C17.2746 3.71694 17.3797 4.29386 17.3797 4.68749C17.3797 5.34554 17.0793 6.00059 16.5624 6.51441L12.7163 10.3846C11.7487 11.3522 10.2764 11.4303 9.423 10.5769C8.93622 10.0901 8.13394 10.0871 7.64416 10.5769C7.15437 11.0667 7.15437 11.866 7.64416 12.3558C8.52156 13.2332 9.67541 13.6779 10.8653 13.6779C12.1514 13.6779 13.4645 13.152 14.4711 12.1394L18.3413 8.29326C19.3238 7.31369 19.8797 6.0036 19.8797 4.68749C19.8797 3.46453 19.417 2.30167 18.5576 1.4423C17.6381 0.522828 16.4032 0.0600874 15.0961 0.120184ZM9.13454 6.32211C7.84848 6.32211 6.51435 6.85095 5.50473 7.86057L1.65858 11.7067C0.676006 12.6863 0.120117 13.9964 0.120117 15.3125C0.120117 16.5354 0.582858 17.6983 1.44223 18.5577C2.3617 19.4772 3.59668 19.9399 4.90377 19.8798C6.15678 19.8197 7.3617 19.2728 8.29319 18.3413L11.947 14.6875C11.3701 15.2644 9.24271 14.8678 8.72589 14.351L6.51435 16.5625C6.02456 17.0523 5.41158 17.3498 4.78358 17.3798C4.3569 17.4008 3.75293 17.3107 3.22108 16.7788C2.72529 16.283 2.62012 15.7031 2.62012 15.3125C2.62012 14.6544 2.9206 13.9994 3.43742 13.4856L7.28358 9.61538C8.25113 8.64783 9.72348 8.57271 10.5768 9.42307C11.0666 9.91285 11.8689 9.91285 12.3557 9.42307C12.8455 8.93328 12.8455 8.13401 12.3557 7.64422C11.4783 6.76682 10.3214 6.32211 9.13454 6.32211Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default IndexPage;