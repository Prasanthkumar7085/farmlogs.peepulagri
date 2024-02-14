import { Drawer, IconButton } from "@mui/material"
import styles from "./farmsDrawer.module.css";
import { Clear } from "@mui/icons-material";
const FarmsListDrawer = ({ drawerOpen, setDrawerOpen }: any) => {
    return (
        <Drawer anchor={"right"} open={drawerOpen}>
            <div className={styles.drawerBlock}>
                <div className={styles.drawerHeadingBlock}>
                    <h3 className={styles.drawerHeading}>Edit Material</h3>
                    <IconButton
                        sx={{ padding: "0" }}
                        onClick={() => {
                            setDrawerOpen(false)
                        }}
                    >
                        <Clear />
                    </IconButton>
                </div>
            </div>
        </Drawer>

    )
}
export default FarmsListDrawer