import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import styles from "./TagsDrawer.module.css";
import TagsTextFeildForImages from "./TagsTextFeildForImages";
const EditTagsForSingleAttachment = ({
  setTagsDrawerEditOpen,
  TagsDrawerEditOpen,
  tagsDrawerClose,
  item,
  captureTagsDetailsEdit,
  loading,
}: any) => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [description, setDescription] = useState<any>("");
  const [tags, setTags] = useState<any>([]);
  const [tagsDetails, setTagsDetails] = useState<
    Partial<{ tags: string[] }> | any
  >({
    tags: [],
  });

  const getImageBasedTags = async () => {
    let options = {
      method: "GET",
      headers: new Headers({
        authorization: accessToken,
      }),
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/farm-images/tags/${item?._id}`,
        options
      );
      const responseData = await response.json();
      if (responseData.success) {
        setTagsDetails(responseData?.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (TagsDrawerEditOpen) {
      setDescription(item?.description);
      getImageBasedTags();
    } else {
      setTags([]);
      setDescription("");
      setTagsDetails({});
    }
  }, [TagsDrawerEditOpen]);

  return (
    <Drawer
      anchor={"bottom"}
      open={TagsDrawerEditOpen}
      sx={{
        zIndex: "1300 !important",
        "& .MuiPaper-root": {
          height: "400px",
          overflowY: "auto",
          padding: "0 1rem 1rem",
          borderRadius: "20px 20px 0 0",
          background: "#F5F7FA",
          maxWidth: "calc(500px - 30px)",
          margin: "0 auto",
        },
      }}
    >
      <div className={styles.updateTagDrawerHeading}>
        <Typography>Tag Images</Typography>
        <IconButton
          onClick={() => {
            tagsDrawerClose(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div style={{ width: "100%" }}>
        <TagsTextFeildForImages
          itemDetails={item}
          beforeTags={tagsDetails?.tags}
          TagsDrawerEditOpen={TagsDrawerEditOpen}
          getImageBasedTags={getImageBasedTags}
        />
      </div>

      <Button
        variant="contained"
        className={styles.updateSubmitBtn}
        onClick={() => {
          setTagsDrawerEditOpen(false);
        }}
      >
        {loading ? (
          <CircularProgress size="1.5rem" sx={{ color: "white" }} />
        ) : (
          "Close"
        )}
      </Button>
    </Drawer>
  );
};

export default EditTagsForSingleAttachment;
