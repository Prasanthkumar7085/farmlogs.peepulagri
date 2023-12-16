import { Avatar, Button, Card, Checkbox, Grid } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import styles from "./TaskViewComponent.module.css"

const TaskViewComponent = () => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    function stringToColor(string: string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    function stringAvatar(name: string) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    return (
        <div className={styles.taskViewPage}>

            <div >
                <Button className={styles.backBtn}> <img src="/viewTaskIcons/back-icon.svg" alt="" width="18px" /> </Button>
            </div>
            <div className={styles.taskViewPageContainer}>
                <Card className={styles.taskViewBlock}>
                    <div className={styles.taskDetailsBlock}>
                        <div className={styles.blockHeading}>
                            <p className={styles.viewTask}>View TAsk</p>
                            <h6 className={styles.farmTitle}>Land Preparation</h6>
                            <div >
                                <p className={styles.statusButtton}>
                                    In-Progress
                                </p>
                            </div>
                        </div>
                        <div className={styles.blockDescription}>
                            <h6 className={styles.description}>Description</h6>
                            <p className={styles.descriptionText}>Farmers prepare the field by plowing and leveling it to create suitable soil conditions for chili cultivation.Land preparation is a crucial step in agriculture that involves various practices to make the land suitable for planting crops. It plays a vital role in ensuring crop growth, uniformity, and overall productivity. Here is a description of land preparation</p>
                        </div>
                        <div className={styles.taskAttachmentsBlock}>
                            <div className={styles.attachmentsHeader}>
                                <p className={styles.attachmentHeading}>Attachments</p>
                                <div className={styles.attachmentBtnGrp}>
                                    <Button className={styles.addAttachmentBtn}><img src="/viewTaskIcons/plus-icon.svg" alt="" width="15px" height="15px" /> Add</Button>
                                    <Button className={styles.deleteAttachmentBtn}> <img src="/viewTaskIcons/delete-icon.svg" alt="" width="15px" height={"16px"} /> </Button>
                                </div>
                            </div>
                            <div className={styles.allAttachmentsBlock}>
                                <div className={styles.singleAttachmentBlock}>
                                    <div className={styles.tumblineBlock}>
                                        <div className={styles.checkbox}>
                                            <Checkbox {...label} sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />

                                        </div>
                                        <img src="/viewTaskIcons/thumbline-img.png" alt="" className={styles.thumbnailImg} />
                                    </div>
                                    <div className={styles.imgTitle}>Postharvest.png</div>
                                    <div className={styles.uploadedDate}>14 Dec 2023</div>
                                    <img src="/viewTaskIcons/download.svg" alt="" />
                                </div>
                                <div className={styles.singleAttachmentBlock}>
                                    <div className={styles.tumblineBlock}>
                                        <div className={styles.checkbox}>
                                            <Checkbox {...label} sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />

                                        </div>
                                        <img src="/viewTaskIcons/thumbline-img.png" alt="" className={styles.thumbnailImg} />
                                    </div>
                                    <div className={styles.imgTitle}>Postharvest.png</div>
                                    <div className={styles.uploadedDate}>14 Dec 2023</div>
                                    <img src="/viewTaskIcons/download.svg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className={styles.fileUploadBlock}>
                            <h6 className={styles.fileUploadHeading}>Upload Attachment</h6>
                            <div className={styles.uploadingFile}>
                            </div>
                        </div>
                    </div>
                    <div className={styles.assignedDetailsBlock}>
                        <div className={styles.DatePickerBlock}>
                            <p className={styles.dueDate}>Due Date</p>
                            <div className={styles.datePicker}></div>
                        </div>
                        <div className={styles.assignedByBlock}>
                            <div className={styles.assignedByHeading}>Assigned By</div>
                            <div className={styles.assignedByName}>
                                <Avatar {...stringAvatar('Daniel Hamilton')} sx={{ fontSize: "6px", width: "18px", height: "18px", background: "#45A845" }} />
                                <p className={styles.assignedByFullName}>
                                    Daniel Hamilton
                                </p>

                            </div>
                        </div>
                        <div className={styles.taskAssignedTeamBlock}>
                            <div className={styles.assigneeTeamHeader}>
                                <div className={styles.assigneeHeading}>
                                    Assign To
                                </div>
                                <Button className={styles.addAssignyBtn}> <img src="/viewTaskIcons/plus-icon.svg" alt="" width="15px" height="15px" /> Add</Button>
                            </div>
                            <div className={styles.allAssignysBlock}>
                                <div className={styles.singleAssignyBlock}>
                                    <div className={styles.checkbox}>
                                        <Checkbox {...label} sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />

                                    </div>
                                    <div className={styles.assingyNameBlock}>
                                        <Avatar {...stringAvatar('Daniel Hamilton')} sx={{ fontSize: "6px", width: "18px", height: "18px", background: "#6A7185" }} />
                                        <p className={styles.assignedByFullName}>
                                            Daniel Hamilton
                                        </p>

                                    </div>

                                </div>
                                <div className={styles.singleAssignyBlock}>
                                    <div className={styles.checkbox}>
                                        <Checkbox {...label} sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />

                                    </div>
                                    <div className={styles.assingyNameBlock}>
                                        <Avatar {...stringAvatar('Daniel Hamilton')} sx={{ fontSize: "6px", width: "18px", height: "18px", background: "#6A7185" }} />
                                        <p className={styles.assignedByFullName}>
                                            Daniel Hamilton
                                        </p>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </Card>
            </div>

        </div>
    );
}

export default TaskViewComponent;