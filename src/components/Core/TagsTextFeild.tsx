import CloseIcon from '@mui/icons-material/Close';
import { IconButton, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import styles from './TagsTextFeild.module.css';

const TagsTextFeild = ({ captureTags, tags }: any) => {
  const [chips, setChips] = useState<any>([]);
  const [inputValue, setInputValue] = useState<any>();

  useEffect(() => {
    setChips(tags);
  }, [tags]);

  const handleKeyDown = (e: any) => {
    if (e.key === " " && inputValue && !chips?.includes(inputValue)) {
      if (chips?.length) {
        setChips([...chips, inputValue]);
        captureTags([...chips, inputValue]);
        setInputValue("");
      }
      else {
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
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
      <TextField
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.tagsBox}
        placeholder="Enter Tags"
      />

      <div className={styles.tagContainer}>
        {chips && chips?.length ? chips.map((chip: any, index: number) => (
          <div
            key={index}
            className={styles.tag}
          >
            <div>{chip}</div>
            <IconButton
              onClick={() => handleDelete(index)}
              className={styles.closeBtn}
              aria-label="delete">
              <CloseIcon />
            </IconButton>
          </div>
        )) : ""}
      </div>
    </div>
  );
};

export default TagsTextFeild;
