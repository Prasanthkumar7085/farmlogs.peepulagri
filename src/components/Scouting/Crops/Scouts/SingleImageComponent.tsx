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
    <div style={{ paddingTop: "1rem" }}
      ref={TagsDrawerEditOpen ? lastItemRef : null}>

      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <Avatar>{detailedImage?.uploaded_by?.name.slice(0, 2).toUpperCase()}</Avatar>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div>{detailedImage?.uploaded_by?.name}</div>
          <div>
            <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem" }}>
              <img src="/viewTaskIcons/calender-icon.svg" alt="icon" />
              {timePipe(detailedImage?.uploaded_at, "DD MMM YY hh:mm A")}</Typography>
          </div>
        </div>
      </div>

      <div style={{ height: "60vh", background: "#000" }}>

        <img
          style={{ objectFit: "contain", height: "100%" }}
          src={detailedImage?.url}
          width={"100%"}
          alt={detailedImage?.key}
        />

      </div>
      {/*    */}

      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
        {/* {detailedImage?.tags?.map((item: string) => {
          return <Chip label={item} key={item} />;
        })} */}

        {detailedImage?.tags.length > 3 ?
          <div>
            {showMore == false ?
              <div style={{ color: "black", fontStyle: "bold", display: "flex", alignItems: "center", alignSelf: "stretch", justifyContent: "space-between" }}>
                <div>
                  {detailedImage?.tags.slice(0, 3).join(",") + "..."}<span onClick={() =>
                    captureImageDilogOptions("tag")
                  }>Show more</span>
                </div>
                <div>
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
              </div> :
              <div >
                {detailedImage?.tags.join(",")}<span onClick={() => setShowMore(false)}>Show less</span>
              </div>}
          </div> :
          <div style={{ color: "black", fontStyle: "bold", }}>
            {detailedImage?.tags?.length ?
              <div>
                <div>
                  {detailedImage?.tags.join(",")
                  }<span onClick={() =>
                    captureImageDilogOptions("tag")
                  }>Add more</span>
                </div>
                <div>
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
                      src={"/add-tag-icon-black.svg"}
                      width={20}
                      height={20}
                      alt="pp"
                    />
                  </IconButton>
                </div>
                <div>
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
