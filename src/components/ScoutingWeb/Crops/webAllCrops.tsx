import { Card, IconButton, Typography } from "@mui/material";
import styles from "../farms/FarmsNavBar.module.css";
import FolderStructure from "./FolderCard";
import CropsNavBarWeb from "./cropsHeader";
import AddIcon from '@mui/icons-material/Add';
import SortIcon from "@mui/icons-material/Sort"
const AllCropsWebPage = () => {
    return (
        <div className={styles.AllFarmsPageWeb} style={{ paddingTop: "1rem !important" }}>
            <div className={styles.selectedForm}>
                <div className={styles.formCard}>
                    <img src="/farmshape.svg" alt="img" />
                    <div className={styles.formDetails}>
                        <h6>Farm1</h6>
                        <p>60 Acres</p>
                    </div>
                </div>
            </div>
            <CropsNavBarWeb />
            <div className={styles.filterBlock}>
                <IconButton sx={{ padding: "0", borderRadius: "none" }}>
                    <SortIcon /><Typography>Sort By</Typography>
                </IconButton>
                <IconButton sx={{ padding: "0", borderRadius: "none" }}>
                    <AddIcon /><Typography >New Folder</Typography>
                </IconButton>
            </div>
            <div className={styles.allFarms} style={{ marginTop: "0 !important" }}>
                <FolderStructure />
            </div>
        </div>
    );
}

export default AllCropsWebPage;