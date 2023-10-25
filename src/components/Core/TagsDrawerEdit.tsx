import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import TagsTextFeild from "./TagsTextFeild";

const TagsDrawerEdit = ({
  TagsDrawerEditOpen,
  tagsDrawerClose,
  item,
  captureTagsDetails,
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
    } else {
      setTags([]);
      setDescription("");
    }
  }, [TagsDrawerEditOpen, item?.tags, item?.description]);


  return (
    <Drawer
      anchor={"bottom"}
      open={TagsDrawerEditOpen}
      sx={{ zIndex: "1300 !important" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem",
          borderBottom: "1px solid #dddddd",
        }}
      >
        <Typography>Tag Images</Typography>
        <IconButton
          onClick={() => {
            tagsDrawerClose(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div style={{ width: "100%", height: "300px " }}>
        <Typography>Tags</Typography>
        <TagsTextFeild captureTags={captureTags} tags={tags} beforeTags={item?.tags} />

        <Typography>Findings</Typography>
        <TextField
          color="primary"
          name="description"
          id="description"
          rows={4}
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
          captureTagsDetails(tags, description);
        }}
      >
        Submit
      </Button>
    </Drawer>
  );
};

export default TagsDrawerEdit;
