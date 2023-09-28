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
{/* <div id={styles.noData} style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "3rem" }}>
    {/* <ImageComponent src='/no-crops-data.svg' height={200} width={200} alt={'no-crops'} /> */}
{/* <Typography variant="h4">No Crops</Typography> */ }
// </div > * /}