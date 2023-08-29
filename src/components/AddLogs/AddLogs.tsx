import type { NextPage } from "next";
import { useState } from "react";
import { TextField, Button, Menu, MenuItem } from "@mui/material";
import styles from "./addlogs.module.css";

import Select, { SelectChangeEvent } from '@mui/material/Select';
import Form from "../FarmForm/form";


const AddLogs: NextPage = () => {

    const [category, setCategory] = useState<string>('');

    const handleChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    return (
        <div className={styles.header}>
            <div className={styles.title}>
                <img className={styles.add1Icon} alt="Add Log" src="/add-icon.svg" />
                <h1 className={styles.addALog}>Add A Log</h1>
            </div>  
            <div className={styles.container}>
                <div style={{ minWidth: "100%" }}>
                    <div className={styles.row}>
                        <TextField
                            className={styles.inputTitle}
                            color="primary"
                            variant="standard"
                            type="text"
                            label="Enter log title"
                            placeholder="Placeholder"
                            size="medium"
                            margin="none"
                            required
                        />
                        <div className={styles.input}>
                            <div>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={category}
                                    label="category"
                                    onChange={handleChange}
                                    placeholder={'Select Category'}
                                    sx={{
                                        height: "35px !important", borderRadius: "3px !important", fontSize: "11px", width: "200px"
                                    }}
                                >

                                    <MenuItem value='soil_preparation'>Soil Preperation</MenuItem>
                                    <MenuItem value='planting'>Plantiing</MenuItem>
                                    <MenuItem value='irrigation'>Irriaion</MenuItem>
                                    <MenuItem value='fertilization'>Fertilization</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className={styles.description}>
                        <TextField
                            className={styles.text}
                            color="primary"
                            variant="standard"
                            multiline
                            label="Enter description here"
                            placeholder="Textarea placeholder"
                            margin="none"
                            fullWidth
                        />
                    </div>
                </div>
                <div className={styles.threeDots}>
                    {/* <div className={styles.threeDotsChild} />
                    <div className={styles.threeDotsChild} />
                    <div className={styles.threeDotsChild} /> */}
                    <Form />
                </div>
            </div>
        </div>
    );
};

export default AddLogs;
