import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './TagsTextFeild.module.css';
import AddIcon from '@mui/icons-material/Add';
const TagsTextFeild = ({ captureTags, tags, beforeTags }: any) => {
  const [tagValue, setTagValue] = useState<any>([]);
  const [newTagValue, setNewTagValue] = useState<any>();
  const [tag, setTag] = useState<any[]>([]);


  useEffect(() => {
    setTagValue(beforeTags ? beforeTags : []);
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


  const addNewTag = () => {
    if (newTagValue) {
      setTag([...tag, newTagValue]);
      setTagValue([...tagValue, newTagValue]);
      setNewTagValue('');
      captureTags([...tagValue, newTagValue]);
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
          inputValue={newTagValue}
          onInputChange={(e, newInputValue) => {
            setNewTagValue(newInputValue)
          }}
          value={tagValue ? tagValue : []}
          onChange={(e, newValue) => {
            { setTagValue(newValue), captureTags(newValue) }
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
      ) : ''}


    </div>
  );
};

export default TagsTextFeild;
