import AddIcon from "@mui/icons-material/Add";
import ClearIcon from '@mui/icons-material/Clear';
import {
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
  Button, // Import Button from MUI
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./TagsTextFeild.module.css";
import { Toaster, toast } from "sonner";

const TagsTextFeild = ({ captureTags, tags, beforeTags }: any) => {
  const [tagValue, setTagValue] = useState<any>();
  const [newTagValue, setNewTagValue] = useState<any>();
  const [tag, setTag] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTextFieldOpen, setIsTextFieldOpen] = useState(false);

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  useEffect(() => {
    setTagValue(beforeTags ? beforeTags : []);
    dropDownTags();
  }, [accessToken]);

  const dropDownTags = async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/farms/list-farm-images/tags/all`;
      const options = {
        method: "GET",

        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
      };
      const response: any = await fetch(url, options);
      const responseData = await response.json();
      setTag(responseData.data.map((item: any) => item.tag));
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addNewTag = () => {
    if (!newTagValue) {
      return;
    }
    if (tagValue.includes(newTagValue) || tag.includes(newTagValue)) {
      toast.error("Tag Already Exists");
      return;
    }
    setTag([...tag, newTagValue]);
    setTagValue([...tagValue, newTagValue]);
    setNewTagValue("");
    captureTags([...tagValue, newTagValue]);
    setIsTextFieldOpen(false); // Close the text field after submitting the new tag
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Tab") {
      addNewTag();
    }
  };
  return (
    <div className={styles.addTagContainer}>
      <div className={styles.listTags}>
        <h5>List your tags below:</h5>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <div style={{ width: "90%" }}>
          {isTextFieldOpen && ( // Conditionally render the text field based on the state
            <TextField
              onKeyDown={handleKeyDown}
              size="small"
              fullWidth
              inputMode="text"
              className={styles.tagsBox}
              placeholder="Enter Tags"
              value={newTagValue}
              onChange={(e) => setNewTagValue(e.target.value)}
            />
          )}
          {!isTextFieldOpen && (
            <Autocomplete
              multiple
              id="tag-autocomplete"
              options={tag?.length ? tag : []}
              getOptionLabel={(option) => option}
              inputValue={newTagValue}
              onInputChange={(e, newInputValue) => {
                setNewTagValue(newInputValue);
              }}
              value={tagValue ? tagValue : []}
              onChange={(e, newValue) => {
                setTagValue(newValue);
                captureTags(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  fullWidth
                  className={styles.tagsBox}
                  placeholder="Enter Tags"
                />
              )}
            />
          )}
        </div>
        {!isTextFieldOpen && (
          <IconButton
            onClick={() => setIsTextFieldOpen(true)}
            sx={{ color: "green" }}
          >
            <AddIcon />
          </IconButton>
        )}
        {isTextFieldOpen && (
          <IconButton
            onClick={() => setIsTextFieldOpen(false)}
            sx={{ color: "red" }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </div>

      {isTextFieldOpen && ( // Conditionally render the submit button based on the state
        <Button variant="contained" color="primary" onClick={addNewTag}>
          Submit
        </Button>
      )}
      {loading ? <LinearProgress sx={{ height: "2px" }} /> : ""}

      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};

export default TagsTextFeild;
