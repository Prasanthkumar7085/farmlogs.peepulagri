import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  IconButton,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./TagsTextFeild.module.css";

const TagsTextFeild = ({ captureTags, tags, beforeTags }: any) => {
  const [tagValue, setTagValue] = useState<any>();
  const [newTagValue, setNewTagValue] = useState<any>();
  const [tag, setTag] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (newTagValue) {
      setTag([...tag, newTagValue]);
      setTagValue([...tagValue, newTagValue]);
      setNewTagValue("");
      captureTags([...tagValue, newTagValue]);
    }
  };

  return (
    <div className={styles.addTagContainer}>
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
          <div>
            <div className={styles.listTags}>
              <h5>List your tags below:</h5>
              <IconButton onClick={addNewTag}>
                <AddIcon />
              </IconButton>
            </div>
            <TextField
              {...params}
              size="small"
              fullWidth
              className={styles.tagsBox}
              placeholder="Enter Tags"
            />
          </div>
        )}
      />
      {loading ? <LinearProgress sx={{ height: "2px" }} /> : ""}
    </div>
  );
};

export default TagsTextFeild;
