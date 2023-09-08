import React from "react";
import ImageComponent from "./ImageComponent";

const NoDataComponent = ({ noData }: { noData: Boolean }) => {
    return (
        <React.Fragment>
            {noData ? <ImageComponent src="/no-support-data.svg" height={400} width={400} alt="nodata" /> : ""}
        </React.Fragment>
    )
}
export default NoDataComponent;