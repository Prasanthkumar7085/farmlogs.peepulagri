import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './TagsTextFeild.module.css';
import AddIcon from '@mui/icons-material/Add';
const TagsTextFeild = ({ captureTags, tags, beforeTags }: any) => {
  const [chips, setChips] = useState<any>([]);
  const [tagValue, setTagValue] = useState<any>();
  const [tag, setTag] = useState([]);


  useEffect(() => {
    setChips(beforeTags);
    dropDownTags()
  }, []);

  const dropDownTags = async () => {

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/scouts/list-tags`;
      const options = {
        method: "GET",

        headers: new Headers({
          'content-type': 'application/json',
        })
      }
      const response: any = await fetch(url, options);
      const responseData = await response.json();
      setTag(responseData.data)


    } catch (err: any) {
      console.error(err);

    }
  };


  return (
    <div className={styles.addTagContainer}>
      {tag.length ? (
        <Autocomplete
          multiple
          id="tag-autocomplete"
          options={tag.length ? tag : []}
          getOptionLabel={(option) => option}
          value={tagValue ? tagValue : chips}
          onChange={(e, newValue) => {
            { setTagValue(newValue), captureTags(newValue) }
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
      ) : ''}


    </div>
  );
};

export default TagsTextFeild;
