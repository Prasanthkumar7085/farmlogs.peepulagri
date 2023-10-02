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
import { Gallery } from "react-grid-gallery";

const ScoutingDetails: FunctionComponent = () => {

  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [data, setData] = useState<SingleScoutResponse>();
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [index, setIndex] = useState<number>(-1);
  

  const getSingleScout = async () => {
    setLoading(true);
    const response = await getSingleScoutService(router.query.scout_id as string, accessToken);
    if (response?.success) {
      setData(response?.data);
    }
    setLoading(false);
  };

  const getModifiedImages = (item: any) => {
    let obj = item?.attachments?.map((imageObj: any, index: number) => {

        if (imageObj.type.slice(0, 4) == "vide") {
            return {
                src: "/videoimg.png",
                original: imageObj.url,
                height: 80,
                width: 60,
                alt: "u",
                customOverlay: (
                    <div className="custom-overlay__caption">
                        <div>{imageObj.name}</div>
                    </div>
                ),
            }
        }
        else
            return {
                src: imageObj.url,
                height: 80,
                width: 60,
                alt: "u"
            }
    });

    return obj;
  }

 

  const handleOpenDialog = () => {
      setOpenDialog(true);
  };

  const handleCloseDialog = () => {
      setOpenDialog(false);
  };
  
  const handleClick = (index: number, item: any) => {
    handleOpenDialog()
    console.log(item)
    setIndex(item.src == "/videoimg.png" ? item.original : item.src)
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
        <div className={styles.attachments}>
          <p className={styles.text}>Attachments</p>
          <div className={styles.gallaryContainer}>
            {data?.attachments.length ? data.attachments.map((item:ScoutAttachmentDetails, index: number) => {
              return (
                <Gallery images={getModifiedImages(item)} onClick={handleClick} key={index} />
                // <div>
                //   <ImageComponent className={styles.imageIcon} alt="ss" src={item.url} height={20} width={20} />
                // </div>
              )
            }) : "No Attachments"}
            
          </div>
        </div>
      </Card>
      <LoadingComponent loading={loading}/>
    </div>
  );
};

export default ScoutingDetails;
