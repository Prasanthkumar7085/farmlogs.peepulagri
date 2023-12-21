import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
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
import addTagService from "../../../lib/services/TagsService/addTagService";
import { SendOutlined } from "@mui/icons-material";

const TagsTextFeildForImages = ({
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
  const [deleteTagLoading, setDeleteTagLoading] = useState(false);
  const [renderField, setRenderField] = useState(true);

  useEffect(() => {
    if (TagsDrawerEditOpen) {
      dropDownTags();
    }
  }, [TagsDrawerEditOpen]);

  useEffect(() => {
    setTagValue(beforeTags ? beforeTags : []);
  }, [beforeTags]);

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

  const addTagToImage = async (value: string, callAllTagsOrNot = false) => {
    if (
      tagValue.find(
        (item: string) => item.toLowerCase() == value?.toLowerCase()
      )
    ) {
      toast.error("Tag already added");
      return;
    }

    try {
      const response = await addTagService({
        body: {
          farm_image_ids: [router.query.image_id as string],
          tags: [value],
        },
        token: accessToken,
      });
      if (response?.success) {
        toast.success(response?.message);
        setIsTextFieldOpen(false);
        getImageBasedTags();
        callAllTagsOrNot ? dropDownTags() : () => {};
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.addTagContainer}>
      <div className={styles.listTags}>
        <h5
          style={{
            paddingBottom: "5px",
            fontSize: "clamp(13px, 2.5vw, 14px)",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "500",
            color: "#000",
          }}
        >
          Tags
        </h5>
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
              onKeyDown={(event: any) =>
                event.key === "Tab" ? addTagToImage(newTagValue) : () => {}
              }
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
              // multiple
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
              // value={extraTags ? extraTags : []}
              onChange={(e, newValue) => {
                setRenderField(false);
                setTimeout(() => {
                  setRenderField(true);
                }, 0.1);

                addTagToImage(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  fullWidth
                  className={styles.tagsBox}
                  placeholder="Select tags to add"
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
          <div style={{ display: "flex " }}>
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
            <IconButton
              className={
                newTagValue ? styles.addNewTagBtn : styles.addNewTagBtnDisabled
              }
              sx={{ background: "#d94841" }}
              disabled={!newTagValue}
              onClick={() => addTagToImage(newTagValue, true)}
            >
              <SendOutlined sx={{ color: "white" }} />
            </IconButton>
          </div>
        )}
      </div>

      {/* {isTextFieldOpen &&
        newTagValue && ( // Conditionally render the submit button based on the state
         
        )} */}
      {loading ? <LinearProgress sx={{ height: "2px" }} /> : ""}

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
                        deleteTagLoading ? () => {} : handleDeleteChip(item)
                      }
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
            ) : (
              <div style={{ color: "#9a9a9a" }}>
                {router.pathname.includes("/view")
                  ? ""
                  : "*No Tags to display*"}
              </div>
            )}
          </div>
        ) : (
          ""
        )}
      </div>

      {/* <Toaster richColors closeButton position="top-right" /> */}
    </div>
  );
};

export default TagsTextFeildForImages;
