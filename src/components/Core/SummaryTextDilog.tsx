import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { CKEditor } from 'ckeditor4-react';
import { Button, Drawer, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import timePipe from '@/pipes/timePipe';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const SummaryTextDilog = ({ summaryDrawerClose, scoutId, anchor, item }: any) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [summaryContent, setSummaryContent] = useState('');
    const [editorHtml, setEditorHtml] = useState('');

    const handleChange = (html: any) => {
        setEditorHtml(html);
    };

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
                {anchor === 'right' ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6">{item?.farm_id?.title}</Typography>
                        {timePipe(item?.createdAt, 'DD MMM YYYY, hh:mm A')}
                    </div>
                ) : null}
                <Typography>Day Summary</Typography>
                <IconButton
                    onClick={() => {
                        summaryDrawerClose(false);
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <div style={{ width: '100%', height: '200px' }}>
                <ReactQuill theme="snow" value={editorHtml} onChange={handleChange} />
            </div>
            <Button variant="contained">Submit</Button>

        </Drawer>
    );
};

export default SummaryTextDilog;
