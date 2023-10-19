import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Button, Drawer, IconButton, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import timePipe from '@/pipes/timePipe';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const SummaryTextDilog = ({ summaryDrawerClose, scoutId, anchor, item, captureSummary }: any) => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [summaryContent, setSummaryContent] = useState('');
    const [editorHtml, setEditorHtml] = useState('');

    const handleChange = (html: any) => {
        setEditorHtml(html);
    };
    const [data, setData] = useState('');


    return (
        <Drawer anchor={'bottom'} open={isDrawerOpen}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderBottom: '1px solid #dddddd',
                    width: anchor === 'right' ? 600 : '',
                }}
            >

                <Typography>Day Summary</Typography>
                <IconButton
                    onClick={() => {
                        summaryDrawerClose(false);
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <div style={{ width: '100%', height: '200px', border: "1px solid red" }}>
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
            <Button variant="contained" onClick={() => {
                captureSummary(data)

            }}>Submit</Button>

        </Drawer>
    );
};

export default SummaryTextDilog;
