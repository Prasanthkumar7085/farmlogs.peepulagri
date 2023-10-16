import { FunctionComponent, useEffect, useState } from "react";
import styles from "./ScoutingDetails.module.css";
import { Card, Drawer, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getSingleScoutService from "../../../../../lib/services/ScoutServices/getSingleScoutService";
import { ScoutAttachmentDetails, SingleScoutResponse } from "@/types/scoutTypes";
import LoadingComponent from "@/components/Core/LoadingComponent";
import FarmDetailsMiniCard from "@/components/AddLogs/farm-details-mini-card";
import timePipe from "@/pipes/timePipe";
import "yet-another-react-lightbox/styles.css";
import VideoDialog from "@/components/Core/VideoDiloag";
import { Gallery } from "react-grid-gallery";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";
import CommentsComponent from "@/components/Scouting/Comments/CommentsComponent";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import CloseIcon from '@mui/icons-material/Close';
import CommentsComponentForWeb from "@/components/Scouting/Comments/CommentsComponentForweb";

const ScoutingDetails = ({ data }: any) => {

  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [index, setIndex] = useState<number>(-1);
  const [content, setContent] = useState<any>()







  return (

    <div className={styles.viewScoutingPage}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p className={styles.startdate}>{timePipe(data?.createdAt, 'DD MMM YYYY hh:mm A')}</p>
          <h1 className={styles.farmname}>{data?.farm_id.title}</h1>

        </div>
        <IconButton onClick={() => {
          router.back()
        }} ><CloseIcon /></IconButton>
      </div>
      <hr></hr>
      <Card className={styles.scoutingdetails}>
        <div className={styles.textwrapper}>
        </div>
        <div className={styles.textwrapper}>
          <h1 className={styles.farmname}>Findings</h1>
          {content?.length ? content?.map((line: any, index: any) => (
            <p className={styles.startdate}>
              {content ? line : "-"}
            </p>)) : "-"}
        </div>

      </Card>
      <div style={{ position: "sticky", marginTop: "48%" }}>
        <Typography variant="h6">Recommedations</Typography>
        <CommentsComponentForWeb />
      </div>
    </div >
  );
};

export default ScoutingDetails;