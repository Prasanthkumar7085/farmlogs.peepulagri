import React from "react";
import ImageComponent from "./ImageComponent";

const NoDataMobileComponent = ({ noData, noDataImg }: { noData: Boolean, noDataImg: any }) => {
    return (
        <React.Fragment>
            {noData ? <ImageComponent src={noDataImg} height={100} width={150} alt="nodata" /> : ""}
        </React.Fragment>
    )
}
export default NoDataMobileComponent;