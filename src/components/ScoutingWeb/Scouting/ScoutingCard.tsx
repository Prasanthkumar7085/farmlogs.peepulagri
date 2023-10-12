import { useCallback, useState } from "react";
import styles from "./ScoutingCard.module.css";
import { useRouter } from "next/router";
import { ScoutAttachmentDetails, SingleScoutResponse } from "@/types/scoutTypes";
import ImageComponent from "@/components/Core/ImageComponent";
import timePipe from "@/pipes/timePipe";
import ViewSingleImagePreview from "@/components/ViewSingleImagePreview";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";

interface pageProps {
  item: SingleScoutResponse;

}

const ScoutingCardWeb = ({ item }: pageProps) => {

  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [index, setIndex] = useState(-1);

  const onViewClick = useCallback(() => {
    router.push(`/farm/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`);
  }, []);

  const viewImagePreview = (index: number) => {
    setOpenDialog(true);
    setIndex(index);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const [state, setState] = useState(false);

  const handleImageLoad = () => {
    setState(true);
  };
  return (
    <div className={styles.scoutingCard}>
      <div className={styles.imgFlexContainer}>
        {item.attachments.length ? item.attachments.slice(0, 6).map((itemObj: ScoutAttachmentDetails, index: number) => {
          return (
            <div key={index} className={item.attachments.length > 3 ? styles.eachImgBox : styles.eachImgBoxLessThan3} onClick={() => viewImagePreview(index)}>
              {itemObj.type.slice(0, 5) == 'video' ?
                <img
                  className={styles.imageIcon}
                  src={'/videoimg.png'}
                  alt={itemObj.name}
                  onLoad={handleImageLoad}
                  style={{ display: state ? "block" : "none" }}
                />

                :
                itemObj.type.includes('application') ?
                  <img
                    className={styles.imageIcon}
                    src={"/pdf-icon.png"}
                    alt={itemObj.name}
                    onLoad={handleImageLoad}
                    style={{ display: state ? "block" : "none" }}
                  /> :
                  <img
                    className={styles.imageIcon}
                    src={itemObj.url}
                    alt={itemObj.name}
                    onLoad={handleImageLoad}
                    style={{ display: state ? "block" : "none" }}
                  />
              }
            </div>
          )
        }) : <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>No Attachments</div>}
      </div>
      <div className={styles.carddetails}>
        <p className={styles.date}>{timePipe(item.createdAt, 'DD MMM YYYY, hh:mm A')}</p>
        <div className={styles.buttons}>
          <div className={styles.view} onClick={onViewClick}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-view-icon.svg"
            />
          </div>
          {/* <div className={styles.edit}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/edit-farm-icon.svg"
            />
          </div>
          <div className={styles.delete}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-delete-icon.svg"
            />
          </div> */}
        </div>
      </div>
      <VideoDialogForScout open={openDialog} onClose={handleCloseDialog} mediaArray={item.attachments} index={index} />
    </div>
  );
};

export default ScoutingCardWeb;
