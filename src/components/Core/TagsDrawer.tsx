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
  tagsDrawerClose,
  item,
  captureTagsDetails,
  selectedItems,
}: any) => {
  console.log(selectedItems);
  console.log(
    selectedItems.some((obj: any) => obj.hasOwnProperty("description") == false)
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [description, setDescription] = useState<any>();
  const [tags, setTags] = useState<any>();

  const captureTags = (array: any) => {
    if (array) {
      setTags(array);
    }
  };

  return (
    <Drawer
      anchor={"bottom"}
      open={isDrawerOpen}
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
        {selectedItems.some((obj: any) => obj.hasOwnProperty("description")) ==
        false ? (
          <>
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
          </>
        ) : // What you want to render if the condition is not met
        // For example, you can render some default component or nothing at all
        null}
      </div>

      <Button
        disabled={!(tags || description)}
        variant="contained"
        onClick={() => {
          captureTagsDetails(tags, description);
          // setTags([]);
          // setDescription("");
        }}
      >
        Submit
      </Button>
    </Drawer>
  );
};

export default TagsDrawer;
