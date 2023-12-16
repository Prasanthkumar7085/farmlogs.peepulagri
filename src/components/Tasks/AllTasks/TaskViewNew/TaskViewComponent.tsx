import { Button, Card, Checkbox, Grid } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import styles from "./TaskViewComponent.module.css"

const TaskViewComponent = () => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    return (
        <div className={styles.taskViewPage}>
            <Grid container columnSpacing={2} className={styles.taskViewPageContainer}>
                <Grid item xs={1}>
                    <Button> <KeyboardBackspaceIcon /> </Button>
                </Grid>
                <Grid item xs={11}>
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
                                        <Button className={styles.addAttachmentBtn}><img src="/viewTaskIcons/plus-icon.svg" alt="" /> Add</Button>
                                        <Button className={styles.deleteAttachmentBtn}> <img src="/viewTaskIcons/delete-icon.svg" alt="" /> </Button>
                                    </div>
                                </div>
                                <div className={styles.allAttachmentsBlock}>
                                    <div className={styles.singleAttachmentBlock}>
                                        <div className={styles.tumblineBlock}>
                                            <div className={styles.checkbox}>
                                                <Checkbox {...label} />

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
                                                <Checkbox {...label} />

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
                        <div>

                        </div>

                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default TaskViewComponent;