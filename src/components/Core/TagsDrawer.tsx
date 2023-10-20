import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { CKEditor } from 'ckeditor4-react';
import { Button, Drawer, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import timePipe from '@/pipes/timePipe';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TagsTextFeild from './TagsTextFeild';
import styles from './TagsDrawer.module.css';
import { ClassNames } from '@emotion/react';

const TagsDrawer = ({ tagsDrawerClose, item, captureTagsDetails }: any) => {
    console.log(item, "in compo")

    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [summaryContent, setSummaryContent] = useState('');
    const [editorHtml, setEditorHtml] = useState('');
    const [description, setDescription] = useState<any>(item?.description ? item.description : "");
    const [tags, setTags] = useState<any>(item?.tags?.length ? item?.tags : [])

    const captureTags = (array: any) => {
        if (array) {
            setTags(array)
        }
    }

    return (
        <Drawer
            anchor={'bottom'}
            open={isDrawerOpen}
            className={styles.AddTagsDrawer}
        >
            <div className={styles.drawerHeading}>
                <Typography variant='h6'>Tag Images</Typography>
                <IconButton
                    onClick={() => {
                        tagsDrawerClose(false);
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <div className={styles.drawerBody}>
                <Typography className={styles.label}>Tags</Typography>
                <div className={styles.inputBox}>
                    <TagsTextFeild size="small" captureTags={captureTags} tags={tags} />
                </div>
                <Typography className={styles.label}>Findings</Typography>
                <div className={styles.inputBox}>
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
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        sx={{ background: "#fff" }}
                        size='small'
                    />
                </div>
            </div>
            <div className={styles.drawerFooter}>
                <Button
                    className={styles.submitBtn}
                    variant="contained" 
                    onClick={() => {
                        captureTagsDetails(tags, description)
                        setTags([])
                        setDescription("")
                    }} 
                >Submit</Button>
            </div>
        </Drawer>
    );
};

export default TagsDrawer;
