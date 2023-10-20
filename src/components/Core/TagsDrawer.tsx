import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import TagsTextFeild from "./TagsTextFeild";

const TagsDrawer = ({
  tagsDrawerOpen,
  tagsDrawerClose,
  item,
  captureTagsDetails,
}: any) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [description, setDescription] = useState<any>(
    item?.description ? item.description : ""
  );
  const [tags, setTags] = useState<any>(item?.tags?.length ? item?.tags : []);

  const captureTags = (array: any) => {
    if (array) {
      setTags(array);
    }
  };

  return (
    <Drawer
      anchor={"bottom"}
      open={tagsDrawerOpen}
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
        <TagsTextFeild captureTags={captureTags} tags={tags} />
        <Typography>Findings</Typography>
        <TextField
          color="primary"
          name="desciption"
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
          captureTagsDetails(tags, description);
          setTags([]);
          setDescription("");
        }}
      >
        Submit
      </Button>
    </Drawer>
  );
};

export default TagsDrawer;
