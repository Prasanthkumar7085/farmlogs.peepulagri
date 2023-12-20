import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import ImageComponent from "@/components/Core/ImageComponent";
import timePipe from "@/pipes/timePipe";
import { CropType, SingleScoutResponse } from "@/types/scoutTypes";
import { AddOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
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
import { useRouter } from "next/router";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import formatText from "../../../../lib/requestUtils/formatTextToBullets";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import postrecomendationsService from "../../../../lib/services/ScoutServices/postrecomendationsService";
import styles from "../Scouting/ViewScouting/ScoutingDetails.module.css";
import style from "./DaySummary.module.css";

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
  const router = useRouter();
  const dispatch = useDispatch();
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
  const userType_v2 = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );

  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

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
    } else if (response?.statusCode == 403) {
      await logout();
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
      toast.success("Recommendations added Successfully");
      setEditRecomendation(false);
      getSingleScoutData();
    } else if (response?.statusCode == 403) {
      await logout();
    } else {
      toast.error("Recommendations added Failed!");
    }
    setUpdateLoading(false);
  };

  useEffect(() => {
    if (!openDaySummary) {
      setRecomendations("");
      setEditRecomendation(false);
    }
  }, [openDaySummary]);

  useEffect(() => {
    if (singleScoutData) {
      getCropName(singleScoutData.crop_id, singleScoutData.farm_id.crops);
      setRecomendations(singleScoutData?.suggestions);
      if (singleScoutData.suggestions) {
        setEditRecomendation(false);
      } else {
        setEditRecomendation(true);
      }
    }
  }, [singleScoutData, openDaySummary]);

  const logout = async () => {
    try {
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };
  return (
    <Drawer
      anchor={"right"}
      open={openDaySummary}
      sx={{
        "& .MuiPaper-root": {
          minWidth: "450px",
          maxWidth: "450px",
        },
      }}
    >
      <div>
        <div className={styles.viewHeader}>
          <div>
            <p className={styles.startdate}>
              {loading ? (
                <div>
                  <Skeleton width="150px" height="10px" />
                </div>
              ) : (
                timePipe(singleScoutData?.createdAt, "DD MMM YYYY hh:mm A")
              )}
            </p>

            <h1 className={styles.cropName}>
              <img src="/cropName-icon.svg" alt="" />
              {loading ? (
                <div>
                  <Skeleton width="130px" height="25px" />
                </div>
              ) : (
                cropName?.title + " "
              )}
            </h1>
            <h2 className={styles.farmname}>
              {loading ? (
                <div>
                  <Skeleton width="130px" height="15px" />
                </div>
              ) : (
                singleScoutData?.farm_id.title +
                "(" +
                singleScoutData?.farm_id.location +
                ")"
              )}
            </h2>
          </div>
          <IconButton
            className={styles.iconDiv}
            onClick={() => setOpenDaySummary(false)}
          >
            <CloseIcon />
          </IconButton>
        </div>
        {/* Summary */}
        <div className={style.scoutingdetails}>
          <div className={style.textwrapper}>
            <h1 className={style.summary}>
              <ImageComponent
                src={"./scouting/summary-icon.svg"}
                height={24}
                width={24}
              />
              <span>Day Summary </span>
            </h1>
            <p className={style.findingText}>
              {loading ? (
                <div style={{ paddingLeft: "10px" }}>
                  <Skeleton width="300px" height="20px" />
                  <Skeleton width="300px" height="20px" />
                  <Skeleton width="300px" height="20px" />
                  <Skeleton width="300px" height="20px" />
                </div>
              ) : (
                <div>
                  {singleScoutData?.summary ? (
                    <div className={style.content}>
                      <Markup content={formatText(singleScoutData?.summary)} />
                    </div>
                  ) : (
                    <div className={style.content}>Summary not added!</div>
                  )}
                </div>
              )}
            </p>
          </div>
        </div>

        {!loading && singleScoutData?.summary ? (
          <div className={style.scoutingdetails}>
            <div className={style.textwrapper}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <h1 className={style.recomendation}>
                  <ImageComponent
                    src={"./scouting/recommendations-icon.svg"}
                    height={24}
                    width={24}
                  />
                  <span>Recommendations</span>
                </h1>
                {loading || editRecomendation || userType_v2 == "USER" ? (
                  ""
                ) : singleScoutData?.suggestions ? (
                  <IconButton
                    className={style.editIcon}
                    onClick={() => {
                      setEditRecomendation(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    className={style.addRecomm}
                    onClick={() => {
                      setEditRecomendation(true);
                    }}
                  >
                    <AddOutlined />
                  </IconButton>
                )}
              </div>

              {!loading && editRecomendation ? (
                <div style={{ width: "100%" }}>
                  {!(userType_v2 == "USER") ? (
                    <TextField
                      className={style.textAria}
                      value={recomendations}
                      onChange={(e) => setRecomendations(e.target.value)}
                      multiline
                      placeholder={"Your Recommendations here..."}
                      minRows={4}
                      maxRows={8}
                      sx={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    <div className={style.recomdationContent}>
                      <Markup
                        content={"<i>*No Recommendations were added*</i>"}
                      />
                    </div>
                  )}
                  {!(userType_v2 == "USER") ? (
                    <div className={style.sendButtonDiv}>
                      <Button
                        className={style.cancelButton}
                        variant="outlined"
                        onClick={() => setEditRecomendation(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className={style.sendButton}
                        variant="contained"
                        onClick={sendRecomendations}
                      >
                        {singleScoutData?.suggestions ? "Update" : " Submit"}
                        {updateLoading ? (
                          <CircularProgress
                            size="1.5rem"
                            sx={{ color: "white" }}
                          />
                        ) : (
                          <SendIcon />
                        )}
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : loading ? (
                <div style={{ paddingLeft: "10px" }}>
                  <Skeleton width="300px" height="20px" />
                  <Skeleton width="300px" height="20px" />
                  <Skeleton width="300px" height="20px" />
                  <Skeleton width="300px" height="20px" />
                </div>
              ) : (
                <div className={style.recomdationContent}>
                  <Markup
                    content={
                      singleScoutData?.suggestions
                        ? formatText(singleScoutData?.suggestions)
                        : "<i>*No Recommendation were added*</i>"
                    }
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}

        <Toaster richColors position="top-right" closeButton />
      </div>
    </Drawer>
  );
};
export default DaySummaryComponent;
