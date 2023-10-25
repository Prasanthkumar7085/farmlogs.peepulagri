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

const TagsDrawer = ({ tagsDrawerClose, item, captureTagsDetails, selectedItems }: any) => {
    console.log(selectedItems)
    console.log(selectedItems.some((obj: any) => obj.hasOwnProperty('description') == false))

    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [description, setDescription] = useState<any>();
    const [tags, setTags] = useState<any>()

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
            < div style={{ width: '100%', height: "300px " }}>
                <Typography>Tags</Typography>
                <TagsTextFeild captureTags={captureTags} tags={tags} />
                {selectedItems.some((obj: any) => obj.hasOwnProperty('description')) == false ? (
                    <>
                        <Typography>Findings</Typography>
                        <TextField
                            color="primary"
                            name="description"
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
                        />
                    </>
                ) : (
                    // What you want to render if the condition is not met
                    // For example, you can render some default component or nothing at all
                    null
                )}

            </div>


            <Button variant="contained" onClick={() => {
                captureTagsDetails(tags, description)
                setTags([])
                setDescription("")
            }}>Submit</Button>

        </Drawer >
    );
};

export default TagsDrawer;
