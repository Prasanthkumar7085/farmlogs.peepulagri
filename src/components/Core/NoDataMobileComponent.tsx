import React from "react";
import ImageComponent from "./ImageComponent";

const NoDataComponent = ({ noData }: { noData: Boolean }, noDataImg: any) => {
    return (
        <React.Fragment>
            {noData ? <ImageComponent src={noDataImg} height={100} width={100} alt="nodata" /> : ""}
        </React.Fragment>
    )
}
export default NoDataComponent;