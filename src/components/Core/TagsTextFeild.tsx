import { TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const TagsTextFeild = ({ captureTags, tags }: any) => {
    const [chips, setChips] = useState<any>(tags?.length ? tags : []);
    const [inputValue, setInputValue] = useState<any>();

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && inputValue) {
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
                sx={{
                    fontSize: '16px',
                    margin: '5px',
                    width: "100%"
                }}
                placeholder='Enter Tags'
            />

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {chips.map((chip: any, index: number) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: '#f0f0f0',
                            padding: '5px',
                            borderRadius: '5px',
                            margin: '5px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ marginRight: '5px' }}>{chip}</div>
                        <button
                            onClick={() => handleDelete(index)}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <span style={{ color: 'red', fontWeight: 'bold' }}>X</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default TagsTextFeild;
