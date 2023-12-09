import React from "react";
import Lottie from "react-lottie-player";
import * as noFarmData from "./noData.json";

const NoDataAnimatedComponent = ({ noData }: { noData: Boolean }) => {
  //   let noFarmData
  return (
    <React.Fragment>
      {noData ? (
        <div>
          <Lottie
            loop
            animationData={noFarmData}
            play
            style={{ width: 300, height: 300 }}
          />
        </div>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};
export default NoDataAnimatedComponent;
