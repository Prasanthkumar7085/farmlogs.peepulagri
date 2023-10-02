import styles from "./view-scout-threads.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import {  ScoutAttachmentDetails, SingleScoutResponse } from "@/types/scoutTypes";
import timePipe from "@/pipes/timePipe";
import { Card } from "@mui/material";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { Gallery } from "react-grid-gallery";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";





const ViewScoutThreads = () => {


  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


  const [data, setData] = useState<SingleScoutResponse>();
  const [downloadUrls, setDownloadUrls] = useState<Array<ScoutAttachmentDetails>>([]);
  const [images, setImages] = useState<any>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>([])
  const [indexOfSeletedOne, setIndexOfseletedOne] = useState<any>();

  const [imagesForDelete, setImagesForDelete] = useState<any>([]);
  const [loading, setLoading] = useState(true);


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const getSingleScout = async () => {
    const response = await getSingleScoutService(router.query?.scout_id as string, accessToken);

    if (response?.success) {
      setData(response?.data);
      if (response?.data?.attachments?.length) {
        setDownloadUrls(response?.data?.attachments);
        setSelectedFile(response?.data?.attachments)

        setResponseAttachmentsFormat({ attachmentdetails: response?.data?.attachments });
      }
    }
    setLoading(false);
  }

  const setResponseAttachmentsFormat = ({ attachmentdetails }: any) => {
    let details = [];
    if (attachmentdetails.length) {
      details = attachmentdetails.map((item: ScoutAttachmentDetails, index: number) => {

        if (item.type.includes('video')) {
          return {
            src: "/videoimg.png", height: 80,
            width: 60, caption: `${index + 1} image`, original: item.url,isSelected: false
          }
        } else {
          return {
            src: item.url, height: 80,
            width: 60,
            isSelected: false
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
    handleOpenDialog();
    setIndexOfseletedOne(item.src == "/videoimg.png" ? item.original : item.src);
  };

  const getSelectedItems = (index: any) => {
    
    const nextImages = images.map((image:any, i:number) =>i === index ? { ...image, isSelected: !image.isSelected } : image);
    setImages([...nextImages]);

    const filteredImages = nextImages.filter((item: any) => item.isSelected);
    setImagesForDelete([...filteredImages]);
  }

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
            {data?.description ? data?.description : "-"}
          </p>
        </div>

        <div className={styles.attachmentscontainer}>
          <h3 className={styles.heading}>Attachments</h3>
          {images.length ? <Card sx={{ width: "100%", minHeight: "100px" }}>
            <Gallery images={images} onClick={handleClick} onSelect={getSelectedItems} enableImageSelection={true} />
          </Card> : ""}

        </div>

      </div>


      <LoadingComponent loading={loading} />
      <VideoDialogForScout open={openDialog} onClose={handleCloseDialog} mediaArray={selectedFile} index={indexOfSeletedOne} />

    </div>
  );
};

export default ViewScoutThreads;
