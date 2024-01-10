import React from "react";
import Lottie from "react-lottie-player";
import styles from "./NoFarmDataComponent.module.css";
import * as noFarmData from "./noData.json";

const NoFarmDataComponent = ({ noData }: { noData: Boolean }) => {
  //   let noFarmData
  return (
    <React.Fragment>
      {noData ? (
        <div className={styles.NoDataBlockImage}>
          {/* <Lottie
            loop
            animationData={noFarmData}
            play
            style={{ width: 300, height: 300 }}
          /> */}
          No Data
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};
export default NoFarmDataComponent;
