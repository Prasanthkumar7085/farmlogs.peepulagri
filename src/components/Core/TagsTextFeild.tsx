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
  const [deleteTagLoading, setDeleteTagLoading] = useState(false);
  const [renderField, setRenderField] = useState(true);

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
    toast.dismiss();
    if (!newTagValue?.trim()?.toLowerCase()) {
      setNewTagValue("");
      return;
    }
    if (
      tagValue.includes(newTagValue?.trim()?.toLowerCase()) ||
      tag.includes(newTagValue?.trim()?.toLowerCase()) ||
      extraTags.includes(newTagValue?.trim()?.toLowerCase())
    ) {
      setNewTagValue("");
      toast.error("Tag Already Exists");
      return;
    } else {
      toast.success("Tag Added Successfully");
    }
    setTag([...tag, newTagValue?.trim()]);
    setExtraTags([...extraTags, newTagValue?.trim()?.toLowerCase()]);
    setNewTagValue("");
    captureTags([...extraTags, newTagValue?.trim()?.toLowerCase()]);
    setIsTextFieldOpen(false);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Tab") {
      addNewTag();
    }
  };
  const handleDeleteChip = async (deletedValue: any) => {
    setDeleteTagLoading(true);
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
    } finally {
      setDeleteTagLoading(false);
    }
  };

  const removeTagsFromExtraTags = (item: string) => {
    let tags = (tempTags: string[]) =>
      tempTags?.filter((tempItem: string) => tempItem != item);
    setExtraTags(tags);
    captureTags(tags);
  };

  return (
    <div className={styles.addTagContainer}>
      <div className={styles.listTags}></div>
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
                        "& .MuiSvgIcon-root:hover": {
                          color: "#d94841 !important",
                        },
                      }}
                      onDelete={() =>
                        deleteTagLoading ? () => { } : handleDeleteChip(item)
                      }
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
              ""
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
          {!isTextFieldOpen && renderField && (
            <Autocomplete
              limitTags={1}
              id="tag-autocomplete"
              options={tag?.length ? tag : []}
              getOptionLabel={(option) => option}
              inputValue={newTagValue}
              onInputChange={(e, newInputValue) => {
                setNewTagValue(newInputValue);
              }}
              getOptionDisabled={(option) =>
                extraTags && extraTags?.includes(option)
              }
              onChange={(e, newValue) => {
                setExtraTags([...extraTags, newValue]);
                captureTags([...extraTags, newValue]);
                setRenderField(false);
                setTimeout(() => {
                  setRenderField(true);
                }, 0.1);
              }}
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
            onClick={() => {
              toast.dismiss();
              setIsTextFieldOpen(true);
            }}
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
            onClick={() => {
              toast.dismiss();
              setIsTextFieldOpen(false);
            }}
          >
            <ClearIcon />
          </IconButton>
        )}
      </div>

      {isTextFieldOpen && ( // Conditionally render the submit button based on the state
        <Button
          disabled={!newTagValue?.trim()?.length}
          className={
            newTagValue?.trim()?.length
              ? styles.addNewTagBtn
              : styles.addNewTagBtnDisabled
          }
          sx={{ background: "#d94841" }}
          variant="contained"
          onClick={addNewTag}
        >
          Add
        </Button>
      )}
      {loading ? <LinearProgress sx={{ height: "2px" }} /> : ""}

      <div>
        {extraTags?.map((item: string, index: number) => {
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
                "& .MuiSvgIcon-root:hover": {
                  color: "#d94841 !important",
                },
              }}
              onDelete={() => removeTagsFromExtraTags(item)}
              key={index}
              label={
                item?.length
                  ? item?.length > 47
                    ? item?.slice(0, 50) + "..."
                    : item
                  : ""
              }
              className={styles.tagsName}
              variant="outlined"
              size="medium"
            />
          );
        })}
      </div>

      <Toaster richColors closeButton position="top-right" />
    </div>
  );
};

export default TagsTextFeild;
