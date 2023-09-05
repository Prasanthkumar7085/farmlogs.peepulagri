import React from "react";
import ImageComponent from "./ImageComponent";

const NoDataComponent = ({ noData }: { noData: Boolean }) => {
    return (
        <React.Fragment>
            {noData ? <ImageComponent src="/no-data.svg" height={500} width={500} alt="nodata" /> : ""}
        </React.Fragment>
    )
}
export default NoDataComponent;