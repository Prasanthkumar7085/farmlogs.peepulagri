import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Button, Drawer, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import timePipe from '@/pipes/timePipe';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import styles from './TagsDrawer.module.css';
import Image from "next/image";

const SummaryTextDilog = ({ summaryDrawerClose, scoutId, anchor, item, captureSummary }: any) => {
    console.log(item, "lllll")

    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [summaryContent, setSummaryContent] = useState('');
    const [editorHtml, setEditorHtml] = useState('');

    const handleChange = (html: any) => {
        setEditorHtml(html);
    };
    const [data, setData] = useState(item?.summary ? item.summary : "");


    return (
        <Drawer anchor={'bottom'} open={isDrawerOpen}>
            
            <div className={styles.drawerHeading}>

                <Typography variant='h6'>
                    <Image
                        alt={`image`}
                        height={24}
                        width={24}
                        src="/summary-icon.svg"
                        style={{ borderRadius: "5%" }}
                    />
                    <span>
                        Day Summary
                    </span>
                </Typography>
                <IconButton
                    onClick={() => {
                        summaryDrawerClose(false);
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <div className={styles.drawerBody}>
                {/* <CKEditor
                    editor={ClassicEditor}
                    data={data}
                    onChange={(event, editor) => {
                        const content = editor.getData();
                        setData(content);
                    }}
                />          */}
                <TextField
                    color="primary"
                    name="desciption"
                    id="description"
                    rows={4}
                    maxRows={4}
                    placeholder="Enter your findings here"
                    fullWidth={true}
                    variant="outlined"
                    multiline
                    value={data}
                    onChange={(e) => {
                        setData(e.target.value);
                    }}
                    sx={{ background: "#fff" }}
                />
            </div>
            
            <div className={styles.drawerFooter}>
                <Button 
                    className={styles.submitBtnSuccess} variant="contained" onClick={() => {
                    captureSummary(data)
                    setData("");
                }} fullWidth>Submit</Button>
            </div>

        </Drawer>
    );
};

export default SummaryTextDilog;
