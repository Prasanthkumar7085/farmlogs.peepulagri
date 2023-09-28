import type { NextPage } from "next";
import styles from "./view-scout-threads.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import { AttachmentsForPreview, ScoutAttachmentDetails, SingleScoutResponse } from "@/types/scoutTypes";
import timePipe from "@/pipes/timePipe";

import { Gallery } from "react-grid-gallery";
import { Image } from "react-grid-gallery";
import "react-image-gallery/styles/css/image-gallery.css"
import { Card, Typography } from "@mui/material";
import LoadingComponent from "@/components/Core/LoadingComponent";





const ViewScoutThreads: NextPage = () => {

  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


  const [data, setData] = useState<SingleScoutResponse>();
  const [downloadUrls, setDownloadUrls] = useState<Array<ScoutAttachmentDetails>>([]);
  const [images, setImages] = useState<Array<Image>>([]);

  const [loading, setLoading] = useState(true);

  const getSingleScout = async () => {
    const response = await getSingleScoutService(router.query?.scout_id as string, accessToken);
    
    if (response?.success) {
      setData(response?.data);
      if (response?.data?.attachments?.length) {
        setDownloadUrls(response?.data?.attachments);
        setResponseAttachmentsFormat({ attachmentdetails: response?.data?.attachments });
      }
    }
    setLoading(false);
  }
  
// { attachmentdetails }:{attachmentdetails: <Array<ScoutAttachmentDetails>>}
  const setResponseAttachmentsFormat = ({ attachmentdetails }: any) => {
    let details = [];
    if (attachmentdetails.length) {
      details = attachmentdetails.map((item: ScoutAttachmentDetails,index:number) => {
        
        if (item.type.includes('video')) {
          return { src: '/video.jpg', width: 200, height:90,caption:`${index+1} image`}
        } else {
          return { src: item.url, width: 150, height:130}
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

  return (
    <div className={styles.viewscoutthreads} id="view-scout-threads">
      <div className={styles.headerandattachments}>
        <div className={styles.headertextwrapper}>
          <h2 className={styles.farm1}>Farm-1</h2>
          <p className={styles.aug20231030am}>{data?.createdAt ? timePipe(data?.createdAt, 'DD, MMM YYYY hh:mm a') : ""}</p>
        </div>
        <div className={styles.description}>
        <h3 className={styles.heading1}>Description</h3>
        <p className={styles.descriptiontext}>
          <span className={styles.identifyingSpecificPests}>
            {data?.description ? data?.description : ""}
          </span>
        </p>
      </div>
        <div className={styles.attachents}>
          <div className={styles.attachmentscontainer}>
            <h3 className={styles.heading}>Attachments</h3>
            {images.length? <Card sx={{ width:"100%",minHeight:"100px" }}>
              <Gallery images={images}  rowHeight={180} />
            </Card>:""}
            {/* {downloadUrls?.length && downloadUrls.map((item: any, index: any) => (
                <Card key={index} style={{ marginTop: "20px" }} onClick={()=>router.push(`/farms/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`)}>
                    <Typography>{timePipe(item.createdAt, "DD-MM-YYYY hh.mm a")}</Typography>
                </Card>
            ))} */}
          </div>
        </div>
      </div>
     

      <LoadingComponent loading={loading}/>
    </div>
  );
};

export default ViewScoutThreads;
