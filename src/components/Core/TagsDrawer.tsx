import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import styles from "./TagsDrawer.module.css";
import TagsTextFeild from "./TagsTextFeild";
import AddMultipleComments from "./AddMultipleComments";

const TagsDrawer = ({
  tagsDrawerClose,
  item,
  captureTagsDetails,
  loading,
  selectedItems,
  tagsDrawerOpen,
  captureCommentDetails,
}: any) => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [description, setDescription] = useState<any>();
  const [tags, setTags] = useState<any>();
  const [comment, setComment] = useState<any>();

  const captureTags = (array: any) => {
    if (array) {
      setTags(array);
    }
  };

  const captureComment = (string: any) => {
    if (string) {
      setComment(string);
    }
  };

  return (
    <Drawer
      anchor={"bottom"}
      open={isDrawerOpen}
      className={styles.AddTagsDrawer}
      sx={{
        '& .MuiPaper-root': {
          maxWidth: "500px", margin: "0 auto", borderRadius: "20px 20px 0 0"
        }
      }}
    >
      <div className={styles.drawerHeading}>
        <Typography variant="h6">Tag Images</Typography>
        <IconButton
          onClick={() => {
            tagsDrawerClose(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div className={styles.drawerBody}>
        <div className={styles.inputBox}>
          <TagsTextFeild captureTags={captureTags} tags={tags} />
        </div>
        <div className={styles.inputBox}>
          <AddMultipleComments captureComment={captureComment} />
        </div>


      </div>
      <div className={styles.drawerFooter}>
        <Button
          className={styles.submitBtn}
          disabled={!(tags || comment || description) || loading}
          variant="contained"
          onClick={() => {
            if (tags) {
              captureTagsDetails(tags, description);
            }
            if (comment) {
              captureCommentDetails(comment);
            }
          }}
        >
          Submit
          {loading ? (
            <CircularProgress size="1.5rem" sx={{ color: "white" }} />
          ) : (
            ""
          )}
        </Button>
      </div>
    </Drawer>
  );
};

export default TagsDrawer;
