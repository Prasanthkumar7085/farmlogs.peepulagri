import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import TagsTextFeild from "./TagsTextFeild";
import styles from "./TagsDrawer.module.css";
const TagsDrawerEdit = ({
  TagsDrawerEditOpen,
  tagsDrawerClose,
  item,
  captureTagsDetailsEdit,
  loading
}: any) => {
  const [description, setDescription] = useState<any>("");
  const [tags, setTags] = useState<any>([]);

  const captureTags = (array: any) => {
    if (array) {
      setTags(array);
    }
  };
  useEffect(() => {
    if (TagsDrawerEditOpen) {
      setDescription(item?.description);
      setTags(item?.tags);
    } else {
      setTags([]);
      setDescription("");
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
        <TagsTextFeild
          captureTags={captureTags}
          tags={tags}
          beforeTags={item?.tags}
        />

        <Typography>Findings</Typography>
        <TextField
          color="primary"
          name="description"
          id="description"
          minRows={4}
          maxRows={4}
          placeholder="Enter your findings here"
          fullWidth={true}
          variant="outlined"
          multiline
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          sx={{ background: "#fff" }}
        />
      </div>

      <Button
        variant="contained"
        onClick={() => {
          captureTagsDetailsEdit(tags, description);
        }}
        className={styles.updateSubmitBtn}
      >
        {loading ?
          <CircularProgress size="1.5rem" sx={{ color: "white" }} />
          : "Submit"}

      </Button>
    </Drawer>
  );
};

export default TagsDrawerEdit;
