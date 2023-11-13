import ImageComponent from "@/components/Core/ImageComponent";
import ShowMoreInViewAttachmentDetails from "@/components/Core/ShowMoreInViewAttachmentDetails";
import TagsDrawerEdit from "@/components/Core/TagsDrawerEdit";
import { Button, Chip, IconButton } from "@mui/material";
import Image from "next/image";
import { FC, useState } from "react";
import DrawerComponentForScout from "../../Comments/DrawerBoxForScout";
import styles from "./singleImage.module.css";
import EditTagsForSingleAttachment from "@/components/Core/EditTagsForSingleAttachment";

interface componentProps {
  detailedImage: any;
  scoutDetails: any;
}
const SingleImageComponent: FC<componentProps> = ({
  detailedImage,
  scoutDetails,
}) => {
  const [TagsDrawerEditOpen, setTagsDrawerEditOpen] = useState<any>(false);

  const [openCommentsBox, setOpenCommentsBox] = useState<any>(false);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState<any>(false);

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
    let body = {
      attachment_ids: [detailedImage?._id],
      tags: tags,
      description: description,
      suggestions: detailedImage?.suggestions,
    };
  };

  return (
    <div>
      <div className={styles.overlay}>
        <img src={detailedImage?.url} height={"auto"} width={"100%"} />
        {detailedImage?.suggestions ? (
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
        {detailedImage?.description
          ? detailedImage?.description?.length > 97
            ? detailedImage?.description?.slice(0, 100) + "..."
            : detailedImage?.description
          : ""}
      </div>
      <div>
        {detailedImage?.tags?.slice(0, 3).map((item: string) => {
          return <Chip label={item} key={item} />;
        })}
        {detailedImage?.tags?.length > 3 ? <span>{"... "}</span> : ""}
      </div>
      {detailedImage?.tags?.length > 3 ||
      detailedImage?.description?.length > 97 ? (
        <span style={{ fontWeight: "bold" }} onClick={openViewMore}>
          Show More
        </span>
      ) : (
        ""
      )}
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
        TagsDrawerEditOpen={TagsDrawerEditOpen}
        // loading={loading}
      />
      <ShowMoreInViewAttachmentDetails
        showMoreSuggestions={showMoreSuggestions}
        setShowMoreSuggestions={setShowMoreSuggestions}
        item={detailedImage ? detailedImage : ""}
      />
    </div>
  );
};

export default SingleImageComponent;
