import React from "react";
import ImageComponent from "./ImageComponent";
import { Typography } from "@mui/material";
import styles from "./NoFarmDataComponent.module.css"
import Lottie from "react-lottie-player";
import * as noFarmData from "./noData.json";

const NoFarmDataComponent = ({ noData }: { noData: Boolean }) => {
  //   let noFarmData
  return (
    <React.Fragment>
      {noData ? (
        <div className={styles.NoDataBlockImage}>
          {/* <ImageComponent src="/no-farms-image.svg" height={150} width={180} alt="nodata" /> */}
          <Lottie
            loop
            animationData={noFarmData}
            play
            style={{ width: 300, height: 300 }}
          />
          {/* <Typography className={styles.title}>No Farms </Typography> */}
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};
export default NoFarmDataComponent;
{/* <div id={styles.noData} style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "3rem" }}>
    {/* <ImageComponent src='/no-crops-data.svg' height={200} width={200} alt={'no-crops'} /> */}
{/* <Typography variant="h4">No Crops</Typography> */ }
// </div > * /}