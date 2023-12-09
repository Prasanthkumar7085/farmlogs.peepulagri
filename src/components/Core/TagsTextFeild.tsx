import AddIcon from "@mui/icons-material/Add";
import ClearIcon from '@mui/icons-material/Clear';
import {
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
  Button,
  Chip, // Import Button from MUI
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./TagsTextFeild.module.css";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
import SellIcon from "@mui/icons-material/Sell";

const TagsTextFeild = ({ captureTags, tags, beforeTags }: any) => {
  const [tagValue, setTagValue] = useState<any>();
  const [newTagValue, setNewTagValue] = useState<any>();
  const [tag, setTag] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTextFieldOpen, setIsTextFieldOpen] = useState(false);
  const router = useRouter();
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
      const url = `${process.env.NEXT_PUBLIC_API_URL}/farm-images/tags/all`;
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
    setExtraTags([...extraTags, newTagValue]);
    setNewTagValue("");
    captureTags([...extraTags, newTagValue]);
    setIsTextFieldOpen(false); // Close the text field after submitting the new tag
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Tab") {
      addNewTag();
    }
  };
  const handleDeleteChip = async (deletedValue: any) => {
    const updatedTags = tagValue.filter((tag: any) => tag !== deletedValue);
    let body = {
      tags: [deletedValue],
      farm_image_ids: [router.query.farm_id],
    };
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/farm-images/delete-tags`;
      const options = {
        method: "DELETE",
        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
        body: JSON.stringify(body),
      };
      const response: any = await fetch(url, options);
      const responseData = await response.json();
    } catch (err) {}

    setTagValue(updatedTags);
    captureTags(updatedTags); // Function to capture updated tags
  };

  const handleTagDelete = (deletedChip: string) => {
    let index = tagValue?.indexOf(deletedChip);
    let temp = [...tagValue];
    temp.splice(index, 1);
    setTagValue(temp);
  };
  const [extraTags, setExtraTags] = useState<any>([]);

  return (
    <div className={styles.addTagContainer}>
      <div className={styles.listTags}>
        <h5>List your tags below:</h5>
      </div>
      <div className={styles.scoutingdetails}>
        {tagValue ? (
          <div className={styles.cropDetailsBlock}>
            {tagValue?.length ? (
              <div className={styles.tagNames}>
                {tagValue?.map((item: string, index: number) => {
                  return (
                    <Chip
                      icon={
                        <SellIcon
                          sx={{ width: "12px", paddingInlineStart: "4px" }}
                        />
                      }
                      onDelete={() => handleDeleteChip(item)}
                      key={index}
                      label={item}
                      className={styles.tagsName}
                      variant="outlined"
                      size="medium"
                      color="success"
                    />
                  );
                })}
              </div>
            ) : (
              <div style={{ color: "#9a9a9a" }}>
                {router.pathname.includes("/add-item")
                  ? ""
                  : "*No Tags to display*"}
              </div>
            )}
          </div>
        ) : (
          ""
        )}
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
              getOptionDisabled={(option) =>
                beforeTags && beforeTags?.includes(option)
              }
              value={extraTags ? extraTags : []}
              onChange={(e, newValue) => {
                // setTagValue(newValue);
                setExtraTags(newValue);
                captureTags(newValue);
              }}
              // renderTags={(value, getTagProps) =>
              //   value.map((option, index) => (
              //     <Chip
              //       key={index}
              //       label={option}
              //       onDelete={() => handleDeleteChip(option)}
              //     />
              //   ))
              // }
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
          Add
        </Button>
      )}
      {loading ? <LinearProgress sx={{ height: "2px" }} /> : ""}

      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};

export default TagsTextFeild;
