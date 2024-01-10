import {
  ScoutAttachmentDetails,
  SingleScoutResponse,
} from "@/types/scoutTypes";
import styles from "../farms/FarmsNavBar.module.css";

interface propTypes {
  item: any;
  onClickAttachment: (attachmentId: string, farmId: string, cropId: string,location_id:string) => void;
}
const ScoutingDailyImages: React.FC<propTypes> = ({
  item,
  onClickAttachment,
}) => {

  return (
    <div className={styles.allScoutImgContainer}>
      {item?.length
        ? item?.map(
          (imageItem: ScoutAttachmentDetails, index: number) => {
           
            
            return (
              <div
                className={styles.singleScoutImg}
                key={index}
                onClick={() => onClickAttachment(imageItem._id, imageItem?.farm_id?._id, imageItem?.crop_id?._id,imageItem?.farm_id?.location_id)}
              >
                <img
                  src={
                    imageItem?.url
                  }
                  height={100}
                  width={100}
                  alt={imageItem.key}
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
