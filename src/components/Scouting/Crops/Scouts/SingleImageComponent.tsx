import EditTagsForSingleAttachment from "@/components/Core/EditTagsForSingleAttachment";
import ImageComponent from "@/components/Core/ImageComponent";
import ShowMoreInViewAttachmentDetails from "@/components/Core/ShowMoreInViewAttachmentDetails";
import { Button, Chip, IconButton, Typography } from "@mui/material";
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
  getImageData: any;
}
const SingleImageComponent: FC<componentProps> = ({
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
        await getImageData();
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
    <div style={{ paddingTop: "1rem" }} >
      <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem" }}>
        <img src="/viewTaskIcons/calender-icon.svg" alt="icon" />
        {timePipe(detailedImage?.uploaded_at, "DD MMM YY hh:mm A")}</Typography>
      <div style={{ height: "60vh", background: "#000" }}>

        <img
          style={{ objectFit: "contain", height: "100%" }}
          src={detailedImage?.url}
          width={"100%"}
          alt={detailedImage?.key}
        />

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

      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
        {detailedImage?.tags?.map((item: string) => {
          return <Chip label={item} key={item} />;
        })}

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
    </div>
  );
};

export default SingleImageComponent;
