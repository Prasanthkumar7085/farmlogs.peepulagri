import {
  ScoutAttachmentDetails,
  SingleScoutResponse,
} from "@/types/scoutTypes";
import styles from "../farms/FarmsNavBar.module.css";

interface propTypes {
  item: SingleScoutResponse;
}
const ScoutingDailyImages: React.FC<propTypes> = ({ item }) => {
  return (
    <div className={styles.allScoutImgContainer}>
      {item?.attachments?.length
        ? item?.attachments?.map(
          (imageItem: ScoutAttachmentDetails, index: number) => {
            return (
              <div className={styles.singleScoutImg}>
                <img
                  src={imageItem?.url}
                  height={100}
                  width={100}
                  alt={imageItem.original_name}
                />
              </div>
            );
          }
        )
        : ""}
    </div>
  );
};

export default ScoutingDailyImages;
