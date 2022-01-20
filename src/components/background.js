import React from "react";
import MuiBox from "@mui/material/Box";

import bg from "../images/bg.png";

export default function Background() {
  return (
    <MuiBox
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        "& img": {
          width: "100%",
        },
      }}
    >
      <img src={bg} />
    </MuiBox>
  );
}
