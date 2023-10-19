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

const TagsDrawer = ({ tagsDrawerClose, item, captureTagsDetails }: any) => {


    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [summaryContent, setSummaryContent] = useState('');
    const [editorHtml, setEditorHtml] = useState('');
    const [description, setDescription] = useState<any>();
    const [tags, setTags] = useState<any>([])

    const captureTags = (array: any) => {
        if (array) {
            setTags(array)
        }
    }

    return (
        <Drawer anchor={'bottom'} open={isDrawerOpen}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderBottom: '1px solid #dddddd',
                }}
            >

                <Typography>Tag Images</Typography>
                <IconButton
                    onClick={() => {
                        tagsDrawerClose(false);
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <div style={{ width: '100%', height: "300px " }}>
                <Typography>Tags</Typography>
                <TagsTextFeild captureTags={captureTags} />
                <Typography>Findings</Typography>
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
                />
            </div>
            <Button variant="contained" onClick={() => captureTagsDetails(tags, description)}>Submit</Button>

        </Drawer>
    );
};

export default TagsDrawer;
