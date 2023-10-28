import CloseIcon from '@mui/icons-material/Close';
import { IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './TagsTextFeild.module.css';
import AddIcon from '@mui/icons-material/Add';
const TagsTextFeild = ({ captureTags, tags, beforeTags }: any) => {
  const [chips, setChips] = useState<any>([]);
  const [inputValue, setInputValue] = useState<any>("");

  useEffect(() => {
    setChips(beforeTags);
  }, [beforeTags]);

  const handleKeyDown = () => {
    if (inputValue && inputValue.trim() && !chips?.includes(inputValue)) {
      if (chips?.length) {
        setChips([...chips, inputValue]);
        captureTags([...chips, inputValue]);
        setInputValue("");
      } else {
        setChips([inputValue]);
        captureTags([inputValue]);
        setInputValue("");
      }
    }
  };

  const handleDelete = (index: any) => {
    const updatedChips = chips.filter(
      (item: any, indexValue: number) => indexValue !== index
    );
    setChips(updatedChips);
    captureTags(updatedChips);
  };

  return (
    <div className={styles.addTagContainer}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>Tags</Typography>
        <IconButton
          onClick={() => handleKeyDown()}
          disabled={inputValue?.trim() ? false : true}
        >
          <AddIcon />
        </IconButton>
      </div>
      <TextField
        size="small"
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.tagsBox}
        placeholder="Enter Tags"
      />

      <div className={styles.tagContainer}>
        {chips && chips?.length
          ? chips.map((chip: any, index: number) => (
              <div key={index} className={styles.tag}>
                <div>{chip}</div>
                <IconButton
                  onClick={() => handleDelete(index)}
                  className={styles.closeBtn}
                  aria-label="delete"
                >
                  <CloseIcon sx={{ fontSize: "1.2rem" }} />
                </IconButton>
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default TagsTextFeild;
