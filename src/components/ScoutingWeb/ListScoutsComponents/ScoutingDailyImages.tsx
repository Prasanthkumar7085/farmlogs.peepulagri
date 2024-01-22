import {
  ScoutAttachmentDetails,
  SingleScoutResponse,
} from "@/types/scoutTypes";
import styles from "../farms/FarmsNavBar.module.css";
import { useRouter } from "next/router";

interface propTypes {
  item: any;

  onClickAttachment: (attachment: any, farmId: string, cropId: string, location_id: string) => void;
  rightBarOpen: boolean;
}
const ScoutingDailyImages: React.FC<propTypes> = ({
  item,
  onClickAttachment,
  rightBarOpen
}) => {

  const router = useRouter();

  return (
    <div className={rightBarOpen || router.query.view ? styles.allScoutImgFlexContainer : styles.allScoutImgContainer}>
      {item?.length
        ? item?.map(
          (imageItem: ScoutAttachmentDetails, index: number) => {


            return (
              <div
                className={styles.singleScoutImg}
                key={index}
                onClick={() => onClickAttachment(imageItem, imageItem?.farm_id?._id, imageItem?.crop_id?._id, imageItem?.farm_id?.location_id)}
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
