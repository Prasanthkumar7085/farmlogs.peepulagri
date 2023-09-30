import type { NextPage } from "next";
import styles from "./view-scout-threads.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import { AttachmentsForPreview, ScoutAttachmentDetails, SingleScoutResponse } from "@/types/scoutTypes";
import timePipe from "@/pipes/timePipe";
import { Card, Typography } from "@mui/material";
import LoadingComponent from "@/components/Core/LoadingComponent";
import Lightbox from "yet-another-react-lightbox";
import { Gallery } from "react-grid-gallery";
import VideoDialog from "@/components/Core/VideoDiloag";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";





const ViewScoutThreads = () => {


  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


  const [data, setData] = useState<SingleScoutResponse>();
  const [downloadUrls, setDownloadUrls] = useState<Array<ScoutAttachmentDetails>>([]);
  const [images, setImages] = useState<any>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>([])
  const [indexOfSeletedOne, setIndexOfseletedOne] = useState<any>()


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [loading, setLoading] = useState(true);

  const getSingleScout = async () => {
    const response = await getSingleScoutService(router.query?.scout_id as string, accessToken);

    if (response?.success) {
      setData(response?.data);
      if (response?.data?.attachments?.length) {
        setDownloadUrls(response?.data?.attachments);
        console.log(response.data)
        setSelectedFile(response?.data?.attachments)

        setResponseAttachmentsFormat({ attachmentdetails: response?.data?.attachments });
      }
    }
    setLoading(false);
  }

  // { attachmentdetails }:{attachmentdetails: <Array<ScoutAttachmentDetails>>}
  const setResponseAttachmentsFormat = ({ attachmentdetails }: any) => {
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
    setImages(details);
  }

  useEffect(() => {
    if (router.isReady, accessToken) {
      getSingleScout();
    }
  }, [router.isReady, accessToken]);



  const handleClick = (index: number, item: any) => {
    handleOpenDialog()
    console.log(item)
    setIndexOfseletedOne(item.src == "/videoimg.png" ? item.original : item.src)
  };

  return (
    <div className={styles.viewscoutthreads} id="view-scout-threads">
      <div className={styles.headerandattachments}>
        <div className={styles.headertextwrapper}>
          <h2 className={styles.farmTitle}>{data?.farm_id?.title ? data?.farm_id?.title : "Farm1"}</h2>
          <p className={styles.createdAt}>{data?.createdAt ? timePipe(data?.createdAt, 'DD, MMM YYYY hh:mm a') : ""}</p>
        </div>
        <div className={styles.description}>
          <h3 className={styles.heading1}>Description</h3>
          <p className={styles.descriptiontext}>
            {data?.description ? data?.description : ""}
          </p>
        </div>

        <div className={styles.attachmentscontainer}>
          <h3 className={styles.heading}>Attachments</h3>
          {images.length ? <Card sx={{ width: "100%", minHeight: "100px" }}>
            <Gallery images={images} onClick={handleClick}
            />

          </Card> : ""}

        </div>

      </div>


      <LoadingComponent loading={loading} />
      <VideoDialogForScout open={openDialog} onClose={handleCloseDialog} mediaArray={selectedFile} index={indexOfSeletedOne} />

    </div>
  );
};

export default ViewScoutThreads;
