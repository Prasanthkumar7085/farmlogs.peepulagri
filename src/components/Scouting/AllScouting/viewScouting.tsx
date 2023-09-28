import type { NextPage } from "next";
import styles from "./view-scout-threads.module.css";

const SingleScoutingView = () => {
    return (
        <div className={styles.viewscoutthreads} id="view-scout-threads">
            <div className={styles.headerandattachments}>
                <div className={styles.headertextwrapper}>
                    <h2 className={styles.farm1}>Farm-1</h2>
                    <p className={styles.aug20231030am}>25 Aug 2023 10:30am</p>
                </div>
                <div className={styles.attachents}>
                    <div className={styles.attachmentscontainer}>
                        <h3 className={styles.heading}>Attachments</h3>
                        <div className={styles.row1}>
                            <div className={styles.imagecontainer}>
                                <img className={styles.imageIcon} alt="" src="/image@2x.png" />
                            </div>
                            <div className={styles.imagecontainer}>
                                <img className={styles.imageIcon} alt="" src="/image1@2x.png" />
                            </div>
                            <div className={styles.imagecontainer}>
                                <img className={styles.imageIcon} alt="" src="/image2@2x.png" />
                            </div>
                        </div>
                        <div className={styles.row1}>
                            <div className={styles.imagecontainer}>
                                <img className={styles.imageIcon} alt="" src="/image3@2x.png" />
                            </div>
                            <div className={styles.imagecontainer}>
                                <img className={styles.imageIcon} alt="" src="/image4@2x.png" />
                            </div>
                            <div className={styles.imagecontainer}>
                                <img className={styles.imageIcon} alt="" src="/image5@2x.png" />
                            </div>
                        </div>
                        <div className={styles.row3}>
                            <div className={styles.imagecontainer}>
                                <img className={styles.imageIcon} alt="" src="/image6@2x.png" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.description}>
                <h3 className={styles.heading1}>Description</h3>
                <p className={styles.descriptiontext}>
                    <span className={styles.identifyingSpecificPests}>
                        Identifying specific pests or diseases present. Selecting and
                        applying appropriate pesticides or treatments.
                    </span>
                    <span className={styles.identifyingSpecificPests}>
                        Monitoring the effectiveness of treatments and reapplying if needed.
                    </span>
                </p>
            </div>
        </div>
    );
}

export default SingleScoutingView;
