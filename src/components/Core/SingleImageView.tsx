import ImageComponent from "@/components/Core/ImageComponent";
import ShowMoreInViewAttachmentDetails from "@/components/Core/ShowMoreInViewAttachmentDetails";
import TagsDrawerEdit from "@/components/Core/TagsDrawerEdit";
import { Button, Chip, Divider, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import styles from "../Scouting/Crops/Scouts/singleImage.module.css";
import EditTagsForSingleAttachment from "@/components/Core/EditTagsForSingleAttachment";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
import DrawerComponentForScout from "../Scouting/Comments/DrawerBoxForScout";
import timePipe from "@/pipes/timePipe";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import ReactPanZoom from "react-image-pan-zoom-rotate";
import { Markup } from "interweave";
import SellIcon from "@mui/icons-material/Sell";
import formatText from "../../../lib/requestUtils/formatTextToBullets";
import LoadingComponent from "./LoadingComponent";

interface componentProps {
  detailedImage: any;
  scoutDetails: any;
  getImageData: any;
}
const SingleImageView: FC<componentProps> = ({
  detailedImage,
  scoutDetails,
  getImageData,
}) => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [TagsDrawerEditOpen, setTagsDrawerEditOpen] = useState<any>(false);

  const [openCommentsBox, setOpenCommentsBox] = useState<any>(false);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState<any>(false);
  const [updateAttachmentLoading, setUpdateAttachmentLoading] = useState(false);
  const [isZoom, setISZoom] = useState<any>();

  const tagsDrawerClose = (value: any) => {
    if (value == false) {
      setTagsDrawerEditOpen(false);
    }
  };
  const drawerClose = (value: any) => {
    if (value == false) {
      setOpenCommentsBox(false);
      // setSelectedItems([]);
    }
  };

  const captureImageDilogOptions = (value: string) => {
    if (value == "tag") {
      setTagsDrawerEditOpen(true);
    } else if (value == "comments") {
      setOpenCommentsBox(true);
    }
  };

  const openViewMore = () => {
    setShowMoreSuggestions(true);
  };

  const captureTagsDetailsEdit = async (tags: any, description: any) => {
    try {
      let body = {
        farm_image_ids: [data._id],
        tags: tags,
      };
      let options = {
        method: "POST",
        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
        body: JSON.stringify(body),
      };

      let response: any = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/tag`,
        options
      );
      let responseData = await response.json();
      if (response?.status >= 200 && response?.status <= 200) {
        toast.success(responseData?.message);
        setTagsDrawerEditOpen(false);
        await getSingleImageDetails();
      } else {
        toast.error(responseData?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateAttachmentLoading(false);
    }
  };

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<any>();
  //get the get image details api
  const getSingleImageDetails = async () => {
    setLoading(true);
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: accessToken,
      }),
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/${router.query.image_id}`,
        options
      );
      const responseData = await response.json();
      if (responseData.success) {
        setData(responseData?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //call the api
  useEffect(() => {
    if (router.isReady) {
      getSingleImageDetails();
    }
  }, [router.isReady, accessToken]);

  return (
    <div>
      <div className={styles.overlay}>
        <div style={{ display: "flex", marginTop: "90px" }}>
          <img
            alt=""
            src="/iconsiconarrowleft.svg"
            onClick={() => router.back()}
          />
          <Typography className={styles.postDate}>
            <InsertInvitationIcon />
            {loading ? (
              "-"
            ) : (
              <span>{timePipe(data?.uploaded_at, "DD-MM-YYYY")}</span>
            )}
          </Typography>
        </div>
        {/* <>
                    {isZoom ? (
                        <ReactPanZoom
                            image={data.url}
                            alt={`Image alt text ${data?.created_at}`}
                        />
                    ) : (
                        <img
                            className="zoom-image"
                            src={data?.url}
                            alt={`Image ${data?.created_at}`}
                            height={"auto"} width={"100%"}
                        />
                    )}
                </> */}
        <div
          style={{
            height: "auto",
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {loading ? (
            ""
          ) : (
            <ReactPanZoom alt={`Image ${data?.created_at}`} image={data?.url} />
          )}
        </div>
        {data?.suggestions ? (
          <div className={styles.remondationsdiv}>
            <div className={styles.recomendations}>
              <Button
                className={styles.button}
                variant="outlined"
                onClick={openViewMore}
              >
                <div className={styles.btnContent}>
                  <ImageComponent
                    src={"/scouting/recommendations-icon.svg"}
                    height={16}
                    width={16}
                  />
                  Recomendations
                </div>
              </Button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        {" "}
        <IconButton
          onClick={() => {
            captureImageDilogOptions("tag");
          }}
        >
          <Image
            src={"/add-tag-icon-black.svg"}
            width={20}
            height={20}
            alt="pp"
          />
        </IconButton>
        <IconButton
          onClick={() => {
            captureImageDilogOptions("comments");
          }}
        >
          <Image
            src={"/comment-black-icon.svg"}
            width={20}
            height={20}
            alt="pp"
          />
        </IconButton>
      </div>
      <div>
        {data?.description
          ? data?.description?.length > 97
            ? data?.description?.slice(0, 100) + "..."
            : data?.description
          : ""}
      </div>
      <div className={styles.scoutingdetails}>
        {data ? (
          <div className={styles.cropDetailsBlock}>
            {data?.tags?.length ? (
              <div className={styles.tagNames}>
                {data?.tags?.length
                  ? data?.tags?.map((item: string, index: number) => {
                    return (
                      <Chip
                        icon={
                          <SellIcon
                            sx={{ width: "12px", paddingInlineStart: "4px" }}
                          />
                        }
                        key={index}
                        label={item}
                        className={styles.tagsName}
                        variant="outlined"
                        size="medium"
                        color="success"
                      />
                    );
                  })
                  : ""}
              </div>
            ) : (
              ""
            )}

            <div className={styles.drawerBody}>
              {data?.description ? (
                <div>
                  <div className={styles.findingDec}>
                    <span
                      className={styles.bodyHeading}
                      style={{ color: "#3462CF" }}
                    >
                      <ImageComponent
                        src={"/scouting/HasSummary.svg"}
                        height={19}
                        width={19}
                        alt="no-summary"
                      />
                      <span>Findings</span>
                    </span>
                    <Typography
                      variant="caption"
                      className={styles.bodyDescription}
                    >
                      <Markup content={formatText(data?.description)} />
                    </Typography>
                  </div>
                  <Divider />
                </div>
              ) : (
                ""
              )}
              <div className={styles.findingDec}>
                <span
                  className={styles.bodyHeading}
                  style={{ color: "#05A155", fontWeight: "600 !important" }}
                >
                  <ImageComponent
                    src={"/scouting/recommendations-icon.svg"}
                    height={16}
                    width={16}
                  />
                  <span>Recommendations</span>
                </span>
                <Typography
                  variant="caption"
                  className={styles.bodyDescription}
                >
                  <Markup
                    content={
                      data?.suggestions
                        ? data?.suggestions
                        : "*No Recommendations added*"
                    }
                  />
                </Typography>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <DrawerComponentForScout
        openCommentsBox={openCommentsBox}
        drawerClose={drawerClose}
        scoutDetails={scoutDetails}
        attachement={data}
      />

      <EditTagsForSingleAttachment
        tagsDrawerClose={tagsDrawerClose}
        captureTagsDetailsEdit={captureTagsDetailsEdit}
        item={data}
        TagsDrawerEditOpen={TagsDrawerEditOpen}
      // loading={loading}
      />

      <LoadingComponent loading={loading} />
    </div>
  );
};

export default SingleImageView;
