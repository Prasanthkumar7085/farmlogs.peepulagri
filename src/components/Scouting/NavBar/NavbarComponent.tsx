import type { NextPage } from "next";
import styles from "./navbar.module.css";
import ImageComponent from "@/components/Core/ImageComponent";
import { IconButton } from "rsuite";
import { useState } from "react";
import { Dialog, DialogTitle } from "@mui/material";
import SideMenu1 from "./side-menu1";

const ScoutingHeader = ({ children }: any) => {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<any>();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: any) => {
        setOpen(false);
        setSelectedValue(value);
    };
    return (
        <div id="mobileBody">
            <div className={styles.navbar} id="navbar">
                <ImageComponent src="/Logo-color.svg" width="70" height="60" />
                <IconButton onClick={handleClickOpen}>
                    <img className={styles.menuIicon} alt="options" src="/menuiicon.svg" />
                </IconButton>
            </div>
            {children}
            <Dialog onClose={handleClose} open={open} sx={{
                '& .MuiPaper-root': {
                    width: "100%",
                    height: "100vh",
                    margin: "0",
                    maxHeight: "inherit !important"
                }
            }}>
                <SideMenu1 />
            </Dialog>
        </div>
    );
};

export default ScoutingHeader;
