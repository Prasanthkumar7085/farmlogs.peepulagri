import type { NextPage } from "next";
import styles from "./view-scout-threads.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import { AttachmentsForPreview, ScoutAttachmentDetails, SingleScoutResponse } from "@/types/scoutTypes";
import timePipe from "@/pipes/timePipe";

import Gallery from 'react-photo-gallery';
import { Image } from "react-grid-gallery";
import "react-image-gallery/styles/css/image-gallery.css"
import { Card, Typography } from "@mui/material";
import LoadingComponent from "@/components/Core/LoadingComponent";
import Lightbox from "yet-another-react-lightbox";





const ViewScoutThreads: NextPage = () => {


  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


  const [data, setData] = useState<SingleScoutResponse>();
  const [downloadUrls, setDownloadUrls] = useState<Array<ScoutAttachmentDetails>>([]);
  const [images, setImages] = useState<any>([]);

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
      details = attachmentdetails.map((item: ScoutAttachmentDetails, index: number) => {

        if (item.type.includes('video')) {
          return {
            src: item.url, width: 200, height: 90, caption: `${index + 1} image`, isVideo: true,
          }
        } else {
          return { src: item.url, width: 150, height: 130 }
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


  const slidesEvent = (item: any) => {
    const slides = item?.attachments?.map((imageObj: any, index: number) => {
      return {

        src: imageObj.url,
        height: 900,
        width: 1000,
        alt: "u",
        isVideo: true,

      }
    });
    return slides
  }
  const [index1, setIndex] = useState(-1);

  const handleClick = (index: any) => setIndex((prev: any) => prev + index1);

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
            <Gallery photos={images} onClick={handleClick}
              renderImage={({ photo }: any) => (
                <div>
                  {photo.isVideo ? (
                    // Render video differently, e.g., video icon
                    <div>
                      <video
                        src={photo.src}
                        width={photo.width}
                        height={photo.height}
                        controls={true}

                      />

                    </div>
                  ) : (
                    // Render images as usual
                    <img
                      src={photo.src}
                      alt={`Image ${photo.key + 1}`}
                      width={photo.width}
                      height={photo.height}
                    />
                  )}
                </div>
              )}
            />
            <Lightbox
              slides={images}
              open={index1 >= 0}
              index={index1}
              close={() => setIndex(-1)}
            />
          </Card> : ""}

        </div>

      </div>


      <LoadingComponent loading={loading} />
    </div>
  );
};

export default ViewScoutThreads;
