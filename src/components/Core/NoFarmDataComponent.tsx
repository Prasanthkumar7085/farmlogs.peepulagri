import React from "react";
import ImageComponent from "./ImageComponent";
import { Typography } from "@mui/material";

const NoFarmDataComponent = ({ noData }: { noData: Boolean }) => {
    return (
        <React.Fragment>
            {noData ?
                <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "3rem" }}>
                    <ImageComponent src="/no-farms-image.svg" height={150} width={250} alt="nodata" />
                    <Typography >No Farms </Typography>
                </div> : ""}

        </React.Fragment>
    )
}
export default NoFarmDataComponent;
{/* <div id={styles.noData} style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "3rem" }}>
    {/* <ImageComponent src='/no-crops-data.svg' height={200} width={200} alt={'no-crops'} /> */}
{/* <Typography variant="h4">No Crops</Typography> */ }
// </div > * /}