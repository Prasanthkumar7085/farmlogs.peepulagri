import { TextField, Typography, Button, IconButton } from '@mui/material';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import styles from './TagsTextFeild.module.css';

const TagsTextFeild = ({ captureTags, tags }: any) => {
    const [chips, setChips] = useState<any>(tags?.length ? tags : []);
    const [inputValue, setInputValue] = useState<any>();

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && inputValue && !chips.includes(inputValue)) {
            setChips([...chips, inputValue]);
            captureTags([...chips, inputValue])
            setInputValue('');
        }
    };

    const handleDelete = (index: any) => {
        const updatedChips = chips.filter((item: any, indexValue: number) => indexValue !== index);
        setChips(updatedChips);
        captureTags(updatedChips)
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

            <TextField
                value={inputValue}
                onKeyDown={handleKeyDown}
                onChange={(e) => setInputValue(e.target.value)}
                fullWidth
                size='small'
                placeholder='Enter Tags'
                className={styles.tagsBox}
            />

            <div className={styles.tagContainer}>
                {chips.map((chip: any, index: number) => (
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
                ))}
            </div>
        </div>

    );
};

export default TagsTextFeild;
