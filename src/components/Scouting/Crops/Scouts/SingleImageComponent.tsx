import EditTagsForSingleAttachment from "@/components/Core/EditTagsForSingleAttachment";
import ImageComponent from "@/components/Core/ImageComponent";
import ShowMoreInViewAttachmentDetails from "@/components/Core/ShowMoreInViewAttachmentDetails";
import { Avatar, Button, Chip, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import DrawerComponentForScout from "../../Comments/DrawerBoxForScout";
import styles from "./singleImage.module.css";
import timePipe from "@/pipes/timePipe";
interface componentProps {
  detailedImage: any;
  scoutDetails: any;
  afterAddingTags: any;
  lastItemRef: any;
}
const SingleImageComponent: FC<Partial<componentProps>> = ({
  detailedImage,
  scoutDetails,
  afterAddingTags,
  lastItemRef
}) => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [TagsDrawerEditOpen, setTagsDrawerEditOpen] = useState<any>(false);
  const [openCommentsBox, setOpenCommentsBox] = useState<any>(false);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState<any>(false);
  const [updateAttachmentLoading, setUpdateAttachmentLoading] = useState(false);
  const [showMore, setShowMore] = useState<any>(false);
  const tagsDrawerClose = (value: any) => {
    if (value == false) {
      setTagsDrawerEditOpen(false);
      afterAddingTags(true);
    }
  };
  const drawerClose = (value: any) => {
    if (value == false) {
      setOpenCommentsBox(false);
      afterAddingTags(true);
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
        farm_image_ids: [detailedImage._id],
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
        toast.success(responseData?.message);
      } else {
        toast.error(responseData?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateAttachmentLoading(false);
    }
  };
  return (
    <div
      ref={TagsDrawerEditOpen ? lastItemRef : null}>
      <div style={{ position: "relative", minHeight: "100px" }}>
        <div className={styles.imageUploadingDetails}>
          <Avatar sx={{ color: "#fff", background: "#d94841", width: "22px", height: "22px", fontSize: "10px" }}>{detailedImage?.uploaded_by?.name.slice(0, 1).toUpperCase()}</Avatar>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div className={styles.uploadedByName}>{detailedImage?.uploaded_by?.name}</div>
            <div>
              <Typography variant="caption" className={styles.imageUploadedTime} >
                <Image src="/mobileIcons/image-uploading-clock-icon.svg" alt="icon" width={15} height={15} />
                {timePipe(detailedImage?.uploaded_at, "DD MMM YY hh:mm A")}</Typography>
            </div>
          </div>
        </div>
        <img
          style={{ objectFit: "contain", height: "100%" }}
          src={detailedImage?.url}
          width={"100%"}
          alt={detailedImage?.key}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
        {detailedImage?.tags.length > 3 ?
          <div style={{ width: "100%" }}>
            {showMore == false ?
              <div style={{ fontStyle: "bold", display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBlock: "0.8rem", paddingInline: "1rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <Image
                    src={"/mobileIcons/singleImage-tag-icon.svg"}
                    width={17}
                    height={17}
                    alt="pp"
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ wordSpacing: "0.5rem", color: "#000" }}>
                      {detailedImage?.tags.slice(0, 3).join(", ")}
                    </span>
                    <span style={{ color: "rgba(0, 0, 0, 0.60) !important", cursor: "pointer", fontSize: "14px" }} onClick={() =>
                      captureImageDilogOptions("tag")
                    }>...Show more</span>
                  </div>
                </div>
                <div>
                  <IconButton
                    className={styles.singleImageCommentBtn}
                    onClick={() => {
                      captureImageDilogOptions("comments");
                    }}
                  >
                    <Image
                      src={"/mobileIcons/singleImage-comment-image.svg"}
                      width={15}
                      height={15}
                      alt="pp"
                    />
                  </IconButton>
                </div>
              </div> :
              <div >
                {detailedImage?.tags.join(",")}<span onClick={() => setShowMore(false)}>Show less</span>
              </div>}
          </div> :
          <div style={{ fontStyle: "bold", width: "100%" }}>
            {detailedImage?.tags?.length ?
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBlock: "0.8rem", paddingInline: "1rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <Image
                    src={"/mobileIcons/singleImage-tag-icon.svg"} width={17}
                    height={17}
                    alt="pp"
                  />
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "3px" }}>
                    <span style={{ color: "#000", wordSpacing: "0.5rem !important" }}>
                      {detailedImage?.tags.join(", ")
                      }</span>
                    <span style={{ color: "rgba(0, 0, 0, 0.60) !important", cursor: "pointer", fontSize: "14px" }} onClick={() =>
                      captureImageDilogOptions("tag")
                    }>...Add more</span>
                  </div>
                </div>
                <div>
                  <IconButton
                    className={styles.singleImageCommentBtn}
                    onClick={() => {
                      captureImageDilogOptions("comments");
                    }}
                  >
                    <Image
                      src={"/mobileIcons/singleImage-comment-image.svg"}
                      width={15}
                      height={15}
                      alt="pp"
                    />
                  </IconButton>
                </div>
              </div>
              :
              <div style={{ color: "black", fontStyle: "bold", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <IconButton
                    onClick={() => {
                      captureImageDilogOptions("tag");
                    }}
                  >
                    <Image
                      src={"/mobileIcons/singleImage-tag-icon.svg"} width={20}
                      height={20}
                      alt="pp"
                    />
                  </IconButton>
                </div>
                <div>
                  <IconButton
                    className={styles.singleImageCommentBtn}

                    onClick={() => {
                      captureImageDilogOptions("comments");
                    }}
                  >
                    <Image
                      src={"/mobileIcons/singleImage-comment-image.svg"}
                      width={15}
                      height={15}
                      alt="pp"
                    />
                  </IconButton>
                </div>
              </div>
            }
          </div>}
      </div>
      <DrawerComponentForScout
        openCommentsBox={openCommentsBox}
        drawerClose={drawerClose}
        scoutDetails={scoutDetails}
        attachement={detailedImage}
      />
      <EditTagsForSingleAttachment
        tagsDrawerClose={tagsDrawerClose}
        captureTagsDetailsEdit={captureTagsDetailsEdit}
        item={detailedImage}
        setTagsDrawerEditOpen={setTagsDrawerEditOpen}
        TagsDrawerEditOpen={TagsDrawerEditOpen}
      />
      <ShowMoreInViewAttachmentDetails
        showMoreSuggestions={showMoreSuggestions}
        setShowMoreSuggestions={setShowMoreSuggestions}
        item={detailedImage ? detailedImage : ""}
      />
      <Toaster closeButton richColors position="top-right" />
    </div >
  );
};
export default SingleImageComponent;