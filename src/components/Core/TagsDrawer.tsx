
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

const TagsDrawer = ({
  tagsDrawerClose,
  item,
  captureTagsDetails,
  loading,
  selectedItems,
  tagsDrawerOpen,
}: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [description, setDescription] = useState<any>();
  const [tags, setTags] = useState<any>();

  const captureTags = (array: any) => {
    if (array) {
      console.log(array, "ma")
      setTags(array);
    }
  };

  return (
    <Drawer
      anchor={"bottom"}
      open={isDrawerOpen}
      className={styles.AddTagsDrawer}
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


      </div>
      <div className={styles.drawerFooter}>
        <Button
          className={styles.submitBtn}
          disabled={!(tags || description) || loading}
          variant="contained"
          onClick={() => {
            captureTagsDetails(tags, description);
            // setTags([]);
            // setDescription("");
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
