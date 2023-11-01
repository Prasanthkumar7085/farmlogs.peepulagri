import CommentsComponentForWeb from "@/components/Scouting/Comments/CommentsComponentForweb";
import timePipe from "@/pipes/timePipe";
import CloseIcon from "@mui/icons-material/Close";
import { Button, CircularProgress, IconButton, Skeleton, TextField, Typography } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "yet-another-react-lightbox/styles.css";
import styles from "./ScoutingDetails.module.css";

import EditIconComponent from "@/components/Core/SvgIcons/EditIcon";
import SuggestionsIcon from "@/components/Core/SvgIcons/SuggitionsIcon";
import { SummaryIcon } from "@/components/Core/SvgIcons/summaryIcon";
import { AddOutlined } from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";
import { Markup } from "interweave";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import style from "../../ListScoutsComponents/DaySummary.module.css";
import formatText from "../../../../../lib/requestUtils/formatTextToBullets";

const ScoutingDetails = ({
  loading,
  data,
  content,
  setPreviewImageDialogOpen,
  imageData,
  afterUpdateRecommandations,
  editRecomendationOpen,
  setEditRecomendationOpen,
}: any) => {
  const [crop, setCrop] = useState<any>();
  const [recomendations, setRecomendations] = useState<any>();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [mainImageData, setMainImageData] = useState<any>();

  useEffect(() => {
    if (imageData && data) {
      let obj = data.attachments?.find(
        (item: any) => item._id == imageData._id
      );
      setMainImageData(obj);
      console.log(obj, "asdf");

      setRecomendations(obj?.suggestions);
      if (obj?.suggestions) {
        setEditRecomendationOpen(false);
        setRecomendations(obj?.suggestions);
      } else {
        setEditRecomendationOpen(true);
        setRecomendations("");
      }
    }
  }, [imageData, data]);

  const getCropName = (cropId: string, crops: any) => {
    let temp = crops?.find((item: any) => item._id == cropId);
    setCrop(temp);
  };

  useEffect(() => {
    if (data) {
      getCropName(data?.crop_id, data?.farm_id?.crops);
    }
  }, [data]);

  return (
    <div className={styles.viewScoutingPage}>
      <div className={styles.viewHeader}>
        <div>
          {loading ? (
            <Skeleton width="200px" />
          ) : (
            <p className={styles.startdate}>
              {timePipe(data?.createdAt, "DD MMM YYYY hh:mm A")}
            </p>
          )}
          {loading ? (
            <Skeleton width="200px" height="30px" />
          ) : (
            <h1 className={styles.cropName}>
              <img src="/cropName-icon.svg" alt="" />
              {crop?.title}{" "}
            </h1>
          )}
          <h2 className={styles.farmname}>
            {loading ? (
              <Skeleton width="300px" height="30px" />
            ) : (
              data?.farm_id.title +
              "     " +
              "(" +
              data?.farm_id?.location +
              ")"
            )}
          </h2>
        </div>
        <IconButton
          className={styles.iconDiv}
          onClick={() => setPreviewImageDialogOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className={style.scoutingdetails}>
        <div className={style.textwrapper}>
          <h6 className={style.summary}>
            <SummaryIcon /> Findings
          </h6>
          {loading ? (
            <div>
              <Skeleton width="400px" height="20px" />
              <Skeleton width="400px" height="20px" />
              <Skeleton width="400px" height="20px" />
              <Skeleton width="400px" height="20px" />
            </div>
          ) : (
            <Markup
              content={
                content?.length
                  ? formatText(content)
                  : "<span class='nocontent'>No findings added yet!</span>"
              }
            />
          )}
        </div>
      </div>

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
            <h6 className={style.recomendation}>
              <SuggestionsIcon />
              Recommendations
            </h6>
            {loading || editRecomendationOpen ? (
              ""
            ) : mainImageData?.suggestions ? (
              <IconButton
                className={style.editIcon}
                onClick={() => {
                  setEditRecomendationOpen(true);
                }}
              >
                <EditIconComponent />
              </IconButton>
            ) : (
              <IconButton
                color="success"
                className={style.addIcon}
                onClick={() => {
                  setEditRecomendationOpen(true);
                }}
              >
                <AddOutlined />
              </IconButton>
            )}
          </div>

          {!loading && editRecomendationOpen ? (
            <div style={{ width: "100%" }}>
              <TextField
                className={style.textAria}
                value={recomendations}
                onChange={(e) => setRecomendations(e.target.value)}
                multiline
                placeholder={"Your recomendations here..."}
                minRows={4}
                maxRows={8}
                sx={{
                  width: "100%",
                }}
              />
              <div className={style.sendButtonDiv}>
                <Button
                  className={style.cancelButton}
                  variant="outlined"
                  size="small"
                  onClick={() => setEditRecomendationOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className={
                    recomendations ? style.sendButton : style.sendButtonDisabled
                  }
                  variant="contained"
                  size="small"
                  disabled={recomendations ? false : true}
                  onClick={() => {
                    let temp = { ...mainImageData };
                    temp.suggestions = recomendations;
                    afterUpdateRecommandations([temp], crop?._id);
                  }}
                >
                  {mainImageData?.suggestions ? "Update" : " Submit"}
                  {updateLoading ? (
                    <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  ) : (
                    ""
                  )}
                </Button>
              </div>
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
                  mainImageData?.suggestions
                    ? formatText(mainImageData?.suggestions)
                    : "<span class='nocontent'>No recommendations added yet!</span>"
                }
              />
            </div>
          )}
        </div>
      </div>
      <div className={styles.RecommedationBlock}>
        <Typography variant="h6" className={styles.RecommedationHeading}>
          Comments
        </Typography>
        <CommentsComponentForWeb
          scoutDetails={data}
          attachement={mainImageData}
        />
      </div>
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};

export default ScoutingDetails;
