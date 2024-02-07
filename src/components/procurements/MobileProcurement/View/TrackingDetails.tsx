import type { NextPage } from "next";
import { Button, Typography } from "@mui/material";
import styles from "./trackingDetails.module.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import TrackingDetailsDilog from "@/components/Core/TrackingDetails/TrackingDetailsDilog";

const TrackingDetails = ({ procurementData, materials, procurementStatusChange }: any) => {

    const userDetails = useSelector(
        (state: any) => state.auth.userDetails?.user_details
    );
    const [openTrackingDilog, setTrackingDialogOpen] = useState<any>(false)


    return (
        <div className={styles.trackingdetails}>
            <div className={styles.titletracking}>
                <img className={styles.trackingicon} alt="" src="/component-30.svg" />
                <h2 className={styles.title}>Tracking Details</h2>
            </div>

            <div className={styles.detailscontainer}>
                {procurementData?.status == "PURCHASED" && userDetails?.user_type == "central_team" && !procurementData?.tracking_details?.service_name ?
                    <div className={styles.trackingid}>
                        <Typography variant="h6" className={styles.trackingBlockHeading}>Tracking Details</Typography>
                        <Button className={styles.addTrackingDetailsBtn} variant="text" onClick={() => {
                            setTrackingDialogOpen(true)
                        }}>+ Add Tracking Details</Button>
                    </div> : ""}

                <div className={styles.detailscontainer} >
                    <label className={styles.lablesmall} >
                        {"sd"}
                    </label>
                    <p className={styles.details} >
                        <span className={styles.superChilliVendors}>{""}</span>
                        <span className={styles.superChilliVendors}>
                            {"da"}
                        </span>
                        <span className={styles.superChilliVendors}>{"Da"}</span>
                    </p>
                </div>

                <div className={styles.trackingid}>
                    <div className={styles.lablewithaction}>
                        <label className={styles.title1}>tracking ID/URL</label>
                        <Button
                            disableElevation={true}
                            color="primary"
                            variant="contained"
                            sx={{ borderRadius: "0px 0px 0px 0px" }}
                        >
                            Copy
                        </Button>
                    </div>
                    <p className={styles.trackingidurl}>1Z 999 AA1 01 2345 6784</p>
                </div>
            </div>
            <TrackingDetailsDilog
                open={openTrackingDilog}
                addTracking={""}
                procurementStatusChange={procurementStatusChange}
                setTrackingDialogOpen={setTrackingDialogOpen}
                loading={false}
            />
        </div>
    );
};

export default TrackingDetails;
