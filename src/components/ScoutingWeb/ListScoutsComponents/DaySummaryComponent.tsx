import { Box, Drawer, IconButton } from "@mui/material";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import styles from "../Scouting/ViewScouting/ScoutingDetails.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { Markup } from "interweave";
import { CropType, SingleScoutResponse } from "@/types/scoutTypes";
import timePipe from "@/pipes/timePipe";

interface pageProps {
  openDaySummary: boolean;
  setOpenDaySummary: Dispatch<SetStateAction<boolean>>;
  seletectedItemDetails: SingleScoutResponse | undefined;
}
const DaySummaryComponent: FC<pageProps> = ({
  openDaySummary,
  setOpenDaySummary,
  seletectedItemDetails,
}) => {
  const [cropName, setCrop] = useState<CropType | undefined>();

  const getCropName = (cropId: string, crops: Array<CropType>) => {
    if (crops.length) {
      let cropObj = crops.find((item: CropType) => item._id == cropId);
      setCrop(cropObj);
    }
  };
  useEffect(() => {
    if (seletectedItemDetails) {
      getCropName(
        seletectedItemDetails.crop_id,
        seletectedItemDetails.farm_id.crops
      );
    }
  }, [seletectedItemDetails]);
  return (
    <Drawer
      anchor={"right"}
      open={openDaySummary}
      onClose={() => setOpenDaySummary(false)}
    >
      <div
        className={styles.viewHeader}
        style={{ minWidth: "400px", maxWidth: "400px" }}
      >
        <div>
          <p className={styles.startdate}>
            {timePipe(seletectedItemDetails?.createdAt, "DD MMM YYYY hh:mm A")}
          </p>

          <h1 className={styles.cropName}>
            <img src="/cropName-icon.svg" alt="" />
            {cropName?.title + " "}
          </h1>
          <h2 className={styles.farmname}>
            {seletectedItemDetails?.farm_id.title}
          </h2>
        </div>
        <IconButton
          className={styles.iconDiv}
          onClick={() => setOpenDaySummary(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className={styles.scoutingdetails}>
        <div className={styles.textwrapper}>
          <h1 className={styles.finding}>Day Summary</h1>
          <p className={styles.findingText}>
            <Markup content={seletectedItemDetails?.findings} />
          </p>
        </div>
      </div>
    </Drawer>
  );
};
export default DaySummaryComponent;
