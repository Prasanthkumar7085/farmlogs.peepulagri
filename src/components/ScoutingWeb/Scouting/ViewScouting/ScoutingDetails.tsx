import { FunctionComponent, useEffect, useState } from "react";
import styles from "./ScoutingDetails.module.css";
import { Card } from "@mui/material";
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


const ScoutingDetails: FunctionComponent = () => {

  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [data, setData] = useState<SingleScoutResponse>();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [index, setIndex] = useState<number>(-1);
  const [finalImages, setFinalImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState<any>([])  

  const getSingleScout = async () => {
    setLoading(true);
    const response = await getSingleScoutService(router.query.scout_id as string, accessToken);
    if (response?.success) {
      setData(response?.data);
      setSelectedFile(response?.data.attachments)

       getModifiedImages({attachmentdetails:response.data.attachments});
      
    }
    setLoading(false);
  };


  const getModifiedImages = ({ attachmentdetails }: any) => {
    let details = [];
    if (attachmentdetails.length) {
      details = attachmentdetails.map((item: ScoutAttachmentDetails, index: number) => {

        if (item.type.includes('video')) {
          return {
            src: "/videoimg.png", height: 80,
            width: 60, caption: `${index + 1} image`, original: item.url
          }
        } else {
          return {
            src: item.url, height: 80,
            width: 60,
          }
        }
      })
    }
    setFinalImages(details);
  }

 

  const handleOpenDialog = () => {
      setOpenDialog(true);
  };

  const handleCloseDialog = () => {
      setOpenDialog(false);
  };
  
  const handleClick = (index: number, item: any) => {
    handleOpenDialog();
    setIndex(index);
};

  useEffect(() => {
    if (router.isReady && accessToken) {
      getSingleScout();
    }
  }, [router.isReady,accessToken]);

  return (
    <div className={styles.viewScoutingPage}>
      <FarmDetailsMiniCard />
      <div className={styles.viewScoutingHeader}>
        <div className={styles.iconDiv} style={{ cursor:"pointer" }} onClick={()=>router.back()}>
          <img src="/arrow-left-back.svg" alt="" width={'18px'} />
        </div>
        <h5>
          VIEW SCOUTING
        </h5>
      </div>
      <Card className={styles.scoutingdetails}>
        <div className={styles.textwrapper}>
          <h1 className={styles.farmname}>{data?.farm_id.title}</h1>
          <p className={styles.startdate}>{timePipe(data?.createdAt,'DD MMM YYYY hh:mm A')}</p>
        </div>
        <div className={styles.textwrapper}>
          <h1 className={styles.farmname}>Description</h1>
          <p className={styles.startdate}>{data?.description ? data?.description : "-"}</p>
        </div>
        
      </Card>
      {/* <div className={styles.gallaryContainer}> */}
            {finalImages.length ?
              <Card sx={{ width: "100%", minHeight: "100px" }} >
                <div className={styles.attachments}>
                  <p className={styles.text}>Attachments</p>
                </div>
                <Gallery images={finalImages} onClick={handleClick} />
              </Card> : ""}
          {/* </div> */}

          <VideoDialogForScout open={openDialog} onClose={handleCloseDialog} mediaArray={selectedFile} index={index} />
      <LoadingComponent loading={loading}/>
    </div>
  );
};

export default ScoutingDetails;
