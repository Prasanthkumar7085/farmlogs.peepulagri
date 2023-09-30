import { FunctionComponent, useCallback } from "react";
import styles from "./FolderCard.module.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';

const FolderStructure: FunctionComponent = () => {
    const onFolderStructureContainerClick = useCallback(() => {
        // Please sync "Scouting" to the project
    }, []);

    return (
        <div className={styles.allCropsCardContainer}>
            <div
                className={styles.folderStructure}
                onClick={onFolderStructureContainerClick}
            >
                <div className={styles.foder}>
                    <img className={styles.folderIcon} alt="" src="/folder.svg" />
                    <div className={styles.moreicon}>
                        < MoreVertIcon sx={{ color: "#FFB110", fontSize: "1.2rem !important" }} />
                    </div>
                </div>
                <div className={styles.textwrapper}>
                    <h6 className={styles.type}>Type 1</h6>
                    <div className={styles.date}>23, Aug 2023</div>
                </div>
            </div>
            <div
                className={styles.folderStructure}
                onClick={onFolderStructureContainerClick}
            >
                <div className={styles.foder}>
                    <img className={styles.folderIcon} alt="" src="/folder.svg" />
                    <div className={styles.moreicon}>
                        < MoreVertIcon sx={{ color: "#FFB110", fontSize: "1.2rem !important" }} />
                    </div>
                </div>
                <div className={styles.textwrapper}>
                    <h6 className={styles.type}>Type 1</h6>
                    <div className={styles.date}>23, Aug 2023</div>
                </div>
            </div>
            <div
                className={styles.folderStructure}
                onClick={onFolderStructureContainerClick}
            >
                <div className={styles.foder}>
                    <img className={styles.folderIcon} alt="" src="/folder.svg" />
                    <div className={styles.moreicon}>
                        < MoreVertIcon sx={{ color: "#FFB110", fontSize: "1.2rem !important" }} />
                    </div>
                </div>
                <div className={styles.textwrapper}>
                    <h6 className={styles.type}>Type 1</h6>
                    <div className={styles.date}>23, Aug 2023</div>
                </div>
            </div>
            <div
                className={styles.folderStructure}
                onClick={onFolderStructureContainerClick}
            >
                <div className={styles.foder}>
                    <img className={styles.folderIcon} alt="" src="/folder.svg" />
                    <div className={styles.moreicon}>
                        < MoreVertIcon sx={{ color: "#FFB110", fontSize: "1.2rem !important" }} />
                    </div>
                </div>
                <div className={styles.textwrapper}>
                    <h6 className={styles.type}>Type 1</h6>
                    <div className={styles.date}>23, Aug 2023</div>
                </div>
            </div>
            <div
                className={styles.folderStructure}
                onClick={onFolderStructureContainerClick}
            >
                <div className={styles.foder}>
                    <img className={styles.folderIcon} alt="" src="/folder.svg" />
                    <div className={styles.moreicon}>
                        < MoreVertIcon sx={{ color: "#FFB110", fontSize: "1.2rem !important" }} />
                    </div>
                </div>
                <div className={styles.textwrapper}>
                    <h6 className={styles.type}>Type 1</h6>
                    <div className={styles.date}>23, Aug 2023</div>
                </div>
            </div>
            <div
                className={styles.folderStructure}
                onClick={onFolderStructureContainerClick}
            >
                <div className={styles.foder}>
                    <img className={styles.folderIcon} alt="" src="/folder.svg" />
                    <div className={styles.moreicon}>
                        < MoreVertIcon sx={{ color: "#FFB110", fontSize: "1.2rem !important" }} />
                    </div>
                </div>
                <div className={styles.textwrapper}>
                    <h6 className={styles.type}>Type 1</h6>
                    <div className={styles.date}>23, Aug 2023</div>
                </div>
            </div>
        </div>
    );
};

export default FolderStructure;
