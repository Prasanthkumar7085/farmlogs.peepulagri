import CommentsComponentForWeb from "@/components/Scouting/Comments/CommentsComponentForweb";
import timePipe from "@/pipes/timePipe";
import CloseIcon from "@mui/icons-material/Close";
import { Button, CircularProgress, IconButton, Skeleton, TextField, Typography } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "yet-another-react-lightbox/styles.css";
import styles from "./ScoutingDetails.module.css";
import { useEffect, useState } from "react";
import { Markup } from "interweave";
import SuggestionsIcon from "@/components/Core/SvgIcons/SuggitionsIcon";
import EditIconComponent from "@/components/Core/SvgIcons/EditIcon";
import SendIcon from "@mui/icons-material/Send";
import { AddOutlined, EditOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import getSingleScoutService from "../../../../../lib/services/ScoutServices/getSingleScoutService";

const ScoutingDetails = ({
  loading,
  data,
  content,
  setPreviewImageDialogOpen,
  imageData,
  afterUpdateRecommandations
}: any) => {
  console.log(imageData, "llop")

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [crop, setCrop] = useState<any>();
  const [editRecomendation, setEditRecomendation] = useState(false);
  const [recomendations, setRecomendations] = useState(imageData?.suggestions);
  const [updateLoading, setUpdateLoading] = useState(false);


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
              data?.farm_id.title
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

      <div className={styles.scoutingdetails}>
        <div className={styles.textwrapper}>
          <h1 className={styles.finding}>Findings</h1>
          {loading ? (
            <div>
              <Skeleton width="400px" height="20px" />
              <Skeleton width="400px" height="20px" />
              <Skeleton width="400px" height="20px" />
              <Skeleton width="400px" height="20px" />
            </div>
          ) : content?.length ? (
            content?.map((line: any, index: any) => (
              <p className={styles.findingText} key={index}>
                {line ? line : "-"}
              </p>
            ))
          ) : (
            "-"
          )}
        </div>
      </div>

      <div >
        <div className={styles.textwrapper}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "80%",
              alignItems: "center",
            }}
          >
            <h6 ><SuggestionsIcon />Recomendations</h6>
            {loading || editRecomendation ? (
              ""
            ) : imageData?.suggestions ? (
              <IconButton
                className={styles.editIcon}
                onClick={() => {
                  setEditRecomendation(true);
                }}
              >
                <EditIconComponent />
              </IconButton>
            ) : (
              <IconButton
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
              <TextField
                className={styles.textAria}
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
              <div className={styles.sendButtonDiv}>
                <Button
                  className={styles.cancelButton}
                  variant="outlined"
                  onClick={() => setEditRecomendation(false)}
                >
                  Cancel
                </Button>
                <Button
                  className={styles.sendButton}
                  variant="contained"
                  onClick={() => {
                    let temp = { ...imageData }
                    temp.suggestions = recomendations
                    afterUpdateRecommandations([temp], crop?._id)
                  }}
                >
                  {imageData?.suggestions ? "Update" : " Submit"}
                  {updateLoading ? (
                    <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                  ) : (
                    <SendIcon />
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
            <div className={styles.recomdationContent} >
              <Markup
                content={
                  imageData?.suggestions
                    ? imageData?.suggestions
                    : "<i>*No Recomendations were added*</i>"
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
        <CommentsComponentForWeb scoutDetails={data} attachement={imageData} />
      </div>
      <Toaster richColors position="top-right" closeButton />

    </div>
  );
};

export default ScoutingDetails;
