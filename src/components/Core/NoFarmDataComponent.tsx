import React from "react";
import ImageComponent from "./ImageComponent";

const NoFarmDataComponent = ({ noData }: { noData: Boolean }) => {
    return (
        <React.Fragment>
            {noData ? <ImageComponent src="/no-support-data.svg" height={400} width={200} alt="nodata" /> : ""}
        </React.Fragment>
    )
}
export default NoFarmDataComponent;