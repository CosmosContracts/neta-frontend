import { Box, Typography, Divider, Card } from "@mui/material";
import React, { memo } from "react";
import Countdown, { calcTimeDelta } from "react-countdown";

const ClaimCard = ({ dateEnd, totalClaimed, claimingGoal }) => {
  const timeDelta = calcTimeDelta(dateEnd);

  const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Typography variant="h4">Claiming is ended</Typography>;
    } else {
      // Render a countdown
      return (
        <Box mt={1}>
          <Typography
            variant="h4"
            mb={3}
            sx={{ fontFeatureSettings: "'salt' on, 'liga' off" }}
          >
            {days}d:{hours}h:{minutes}m:{seconds}s
          </Typography>
          <Typography variant="h5">
            until{" "}
            <Typography
              variant="h5"
              component="span"
              color="primary.main"
              px={0.5}
            >
              {claimingGoal} NETA
            </Typography>{" "}
            will be burn
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        borderRadius: "24px",
      }}
    >
      <Box py={7.5} px={5}>
        <Typography variant="h5" mb={3} sx={{ textTransform: "uppercase" }}>
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
        <Countdown
          date={Date.now() + timeDelta.total}
          renderer={countdownRenderer}
        />
      </Box>
    </Card>
  );
};

export default memo(ClaimCard);
