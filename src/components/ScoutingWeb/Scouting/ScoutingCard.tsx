import { useCallback } from "react";
import styles from "./ScoutingCard.module.css";
import { useRouter } from "next/router";
import { ScoutAttachmentDetails, SingleScoutResponse } from "@/types/scoutTypes";
import ImageComponent from "@/components/Core/ImageComponent";

interface pageProps{
  item: SingleScoutResponse;
  
}

const ScoutingCardWeb = ({ item }: pageProps) => {

  const router = useRouter();

  const onViewClick = useCallback(() => {
    router.push(`/farm/${router.query.farm_id}/crops/${router.query.crop_id}/scouting/${item._id}`);
  }, []);

  return (
    <div className={styles.scoutingCard}>
      <div className={styles.imgFlexContainer}>
        {item.attachments.slice(0,6).map((item:ScoutAttachmentDetails,index:number) => (
          <div key={index} className={styles.eachImgBox}>
            <ImageComponent
              className={styles.imageIcon}
              height={30}
              width={30}
              src={item.url}
              alt={item.name}
            />
          </div>
        ))}
      </div>
      <div className={styles.carddetails}>
        <p className={styles.date}>25 Aug 2023 10:30AM</p>
        <div className={styles.buttons}>
          <div className={styles.view}
            onClick={onViewClick}
          >
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-view-icon.svg"
            />
          </div>
          <div className={styles.edit}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutingCardWeb;
