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

const ScoutingDetails = ({ drawerClose, item }: any) => {

  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [data, setData] = useState<SingleScoutResponse>();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [index, setIndex] = useState<number>(-1);
  const [finalImages, setFinalImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState<any>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getSingleScout = async () => {
    setLoading(true);
    const response = await getSingleScoutService(
      router.query.scout_id as string,
      accessToken
    );
    if (response?.success) {
      console.log(response?.data, "testing");

      setData(response?.data);
      setSelectedFile(response?.data.attachments);

      getModifiedImages({ attachmentdetails: response.data.attachments });
    }
    setLoading(false);
  };

  const getModifiedImages = ({ attachmentdetails }: any) => {
    let details = [];
    if (attachmentdetails.length) {
      details = attachmentdetails.map(
        (item: ScoutAttachmentDetails, index: number) => {
          if (item.type.includes("video")) {
            return {
              src: "/videoimg.png",
              height: 80,
              width: 60,
              caption: `${index + 1} image`,
              original: item.url,
            };
          } else if (item.type.includes("application")) {
            return {
              src: "/pdf-icon.png",
              height: 80,
              width: 60,
              caption: `${index + 1} image`,
              original: item.url,
            };
          } else {
            return {
              src: item.url,
              height: 80,
              width: 60,
            };
          }
        }
      );
    }
    setFinalImages(details);
  };

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
    if (router.isReady && accessToken && router.query.scout_id) {
      getSingleScout();
    }
  }, [router.isReady, accessToken, router.query.scout_id]);

  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
    >
      <div className={styles.viewScoutingPage} style={{ width: 600 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>


          <IconButton onClick={() => {
            drawerClose(false)
          }} ><CloseIcon /></IconButton>
        </div>
        <Card className={styles.scoutingdetails}>
          <div className={styles.textwrapper}>
            <h1 className={styles.farmname}>{data?.farm_id.title}</h1>
            <p className={styles.startdate}>{timePipe(data?.createdAt, 'DD MMM YYYY hh:mm A')}</p>
          </div>
          <div className={styles.textwrapper}>
            <h1 className={styles.farmname}>Findings</h1>
            <p className={styles.startdate}>{data?.findings ? data?.findings : "-"}</p>
          </div>

        </Card>
        <div style={{ position: "sticky", bottom: 0, marginTop: "70%" }}>
          <Typography variant="h6">Recommedations</Typography>
          <CommentsComponentForWeb />
        </div>
        <VideoDialogForScout open={openDialog} onClose={handleCloseDialog} mediaArray={selectedFile} index={index} />
        <LoadingComponent loading={loading} />
      </div >
    </Drawer >
  );
};

export default ScoutingDetails;