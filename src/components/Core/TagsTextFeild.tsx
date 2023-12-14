import AddIcon from "@mui/icons-material/Add";
import ClearIcon from '@mui/icons-material/Clear';
import {
  Autocomplete,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import styles from "./TagsTextFeild.module.css";

const TagsTextFeild = ({
  captureTags,
  tags,
  beforeTags,
  TagsDrawerEditOpen,
  getImageBasedTags,
}: any) => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [tagValue, setTagValue] = useState<any>();
  const [newTagValue, setNewTagValue] = useState<any>();
  const [tag, setTag] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTextFieldOpen, setIsTextFieldOpen] = useState(false);
  const [extraTags, setExtraTags] = useState<any>([]);

  useEffect(() => {
    setTagValue(beforeTags ? beforeTags : []);
    dropDownTags();
  }, [TagsDrawerEditOpen, beforeTags]);

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
    if (!newTagValue?.trim()) {
      return;
    }
    if (
      tagValue.includes(newTagValue?.trim()) ||
      tag.includes(newTagValue?.trim())
    ) {
      toast.error("Tag Already Exists");
      return;
    } else {
      toast.success("Tag Added Successfully");
    }
    setTag([...tag, newTagValue?.trim()]);
    setExtraTags([...extraTags, newTagValue?.trim()]);
    setNewTagValue("");
    captureTags([...extraTags, newTagValue?.trim()]);
    setIsTextFieldOpen(false);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Tab") {
      addNewTag();
    }
  };
  const handleDeleteChip = async (deletedValue: any) => {
    let body = {
      tags: [deletedValue],
      farm_image_ids: [router.query.image_id],
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
      if (responseData?.success) {
        toast.success(responseData?.message);
        await getImageBasedTags();
      } else {
        toast.error(responseData?.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.addTagContainer}>
      <div className={styles.listTags}>
        <h5 style={{ paddingBottom: "5px", fontSize: "clamp(13px, 2.5vw, 14px)", fontFamily: "'Inter', sans-serif", fontWeight: "500", color: "#000" }}>Tags</h5>
      </div>
      <div className={styles.scoutingdetails}>
        {tagValue ? (
          <div className={styles.cropDetailsBlock}>
            {tagValue?.length ? (
              <div className={styles.tagNames}>
                {tagValue?.map((item: string, index: number) => {
                  return (
                    <Chip
                      sx={{
                        border: "1px solid #d94841",
                        color: "#d94841",
                        marginRight: "5px",
                        marginBottom: "10px",
                        "& .MuiSvgIcon-root": {
                          color: "#d94841",
                        },
                        '& .MuiSvgIcon-root:hover': {
                          color: "#d94841 !important",

                        }
                      }}
                      onDelete={() => handleDeleteChip(item)}
                      key={index}
                      label={item}
                      className={styles.tagsName}
                      variant="outlined"
                      size="medium"
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
              sx={{
                "& .MuiInputBase-root": {
                  background: "#fff",
                  paddingBlock: "4px !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey !important",
                  borderRadius: "4px",
                },
              }}
            />
          )}
          {!isTextFieldOpen && (
            <Autocomplete
              multiple
              limitTags={1}
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
                  sx={{
                    "& .MuiInputBase-root": {
                      background: "#fff",
                      paddingBlock: "8px !important",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "grey !important",
                      borderRadius: "4px",
                    },
                  }}
                />
              )}
            />
          )}
        </div>
        {!isTextFieldOpen && (
          <IconButton
            onClick={() => setIsTextFieldOpen(true)}
            sx={{
              color: "green",
              border: "1px solid grey",
              borderRadius: "4px",
            }}
          >
            <AddIcon />
          </IconButton>
        )}
        {isTextFieldOpen && (
          <IconButton
            sx={{
              color: "#d94841",
              border: "1px solid #d9484",
              borderRadius: "4px",
            }}
            onClick={() => setIsTextFieldOpen(false)}

          >
            <ClearIcon />
          </IconButton>
        )}
      </div>

      {isTextFieldOpen && ( // Conditionally render the submit button based on the state
        <Button
          className={styles.addNewTagBtn}
          sx={{ background: "#d94841" }}
          variant="contained"
          onClick={addNewTag}
        >
          Add
        </Button>
      )}
      {loading ? <LinearProgress sx={{ height: "2px" }} /> : ""}

      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};

export default TagsTextFeild;
