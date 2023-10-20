import timePipe from "@/pipes/timePipe";
import { CropType, SingleScoutResponse } from "@/types/scoutTypes";
import { EditOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import {
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Skeleton,
  TextField,
} from "@mui/material";
import { Markup } from "interweave";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import postrecomendationsService from "../../../../lib/services/ScoutServices/postrecomendationsService";
import styles from "../Scouting/ViewScouting/ScoutingDetails.module.css";

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
  const [recomendations, setRecomendations] = useState("");
  const [editRecomendation, setEditRecomendation] = useState(false);
  const [singleScoutData, setSingleScoutData] = useState<SingleScoutResponse>();
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (seletectedItemDetails) {
      getSingleScoutData();
    }
  }, [seletectedItemDetails]);

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const getCropName = (cropId: string, crops: Array<CropType>) => {
    if (crops.length) {
      let cropObj = crops.find((item: CropType) => item._id == cropId);
      setCrop(cropObj);
    }
  };

  const getSingleScoutData = async () => {
    setLoading(true);
    const response = await getSingleScoutService(
      seletectedItemDetails?._id as string,
      accessToken
    );
    if (response?.success) {
      setSingleScoutData(response?.data);
    }
    setLoading(false);
  };

  const sendRecomendations = async () => {
    setUpdateLoading(true);
    let body = {
      ...singleScoutData,
      farm_id: singleScoutData?.farm_id._id,
      created_by: singleScoutData?.created_by._id,
      suggestions: recomendations,
    };
    const response = await postrecomendationsService(
      singleScoutData?._id,
      accessToken,
      body
    );
    if (response?.success) {
      toast.success("Recomendations added Successfully");
      setEditRecomendation(false);
      getSingleScoutData();
    } else {
      toast.error("Recomendations added Failed!");
    }
    setUpdateLoading(false);
  };

  useEffect(() => {
    if (!openDaySummary) {
      setRecomendations("");
    }
  }, [editRecomendation]);

  useEffect(() => {
    if (singleScoutData) {
      getCropName(singleScoutData.crop_id, singleScoutData.farm_id.crops);
      setRecomendations(singleScoutData?.suggestions);
    }
  }, [singleScoutData]);
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
            {timePipe(singleScoutData?.createdAt, "DD MMM YYYY hh:mm A")}
          </p>

          <h1 className={styles.cropName}>
            <img src="/cropName-icon.svg" alt="" />
            {cropName?.title + " "}
          </h1>
          <h2 className={styles.farmname}>{singleScoutData?.farm_id.title}</h2>
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
            {loading ? (
              <div style={{ paddingLeft: "30px" }}>
                <Skeleton width="300px" height="150px" />
              </div>
            ) : (
              <div style={{ maxWidth: "300px" }}>
                <Markup content={singleScoutData?.summary} />
              </div>
            )}
          </p>
        </div>
      </div>

      {!singleScoutData?.suggestions || editRecomendation ? (
        <div className={styles.scoutingdetails}>
          <div className={styles.textwrapper}>
            <h1 className={styles.finding}>Recomendations</h1>

            {loading ? (
              <div style={{ paddingLeft: "30px" }}>
                <Skeleton width="300px" height="150px" />
              </div>
            ) : (
              <TextField
                value={recomendations}
                onChange={(e) => setRecomendations(e.target.value)}
                multiline
                placeholder={"Your recomendations here..."}
                minRows={4}
                maxRows={4}
                sx={{
                  width: "100%",
                }}
              />
            )}
          </div>
          {loading ? (
            ""
          ) : (
            <div className={styles.sendButtonDiv}>
              {singleScoutData?.suggestions ? (
                <Button
                  className={styles.cancelButton}
                  variant="outlined"
                  onClick={() => setEditRecomendation(false)}
                >
                  Cancel
                </Button>
              ) : (
                ""
              )}
              <Button
                className={styles.sendButton}
                variant="contained"
                onClick={sendRecomendations}
              >
                Send
                {updateLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                ) : (
                  <SendIcon />
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.scoutingdetails}>
          <div className={styles.textwrapper}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <h1 className={styles.finding}>Recomendations</h1>
              <IconButton
                onClick={() => {
                  setEditRecomendation(true);
                }}
              >
                <EditOutlined />
              </IconButton>
            </div>
            <div style={{ maxWidth: "300px" }}>
              <Markup content={singleScoutData?.suggestions} />
            </div>
          </div>
        </div>
      )}
      <Toaster richColors position="top-right" closeButton />
    </Drawer>
  );
};
export default DaySummaryComponent;
