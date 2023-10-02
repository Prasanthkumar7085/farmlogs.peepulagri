import styles from "./navbar.module.css";
import ImageComponent from "@/components/Core/ImageComponent";
import { IconButton } from "rsuite";
import React, { useState } from "react";
import { Box, Drawer } from "@mui/material";
import SideMenu1 from "./side-menu1";
import { useRouter } from "next/router";

type Anchor =  'right';

const ScoutingHeader = ({ children }: any) => {
    const router = useRouter();
    const [state, setState] = useState({ right: false });

    const toggleDrawer = (open: boolean) => {
        setState({ ...state, 'right': open });
    };


    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: '100%' }}
            role="presentation"
        >
            <SideMenu1 toggleDrawer={toggleDrawer} />
        </Box>
    );

    return (
        <div id="mobileBody">
            <div id={styles.navBar}>
                <div className={styles.navbar}>
                    <ImageComponent onClick={() => router.push('/farms')} src="/Logo-color.svg" width="70" height="60" />
                    <IconButton onClick={() => toggleDrawer(true)}>
                        <img className={styles.menuIicon} alt="options" src="/menuiicon.svg" />
                    </IconButton>
                </div>
            </div>
            {children}
            <React.Fragment>
                <Drawer
                    anchor={'right'}
                    open={state['right']}
                    sx={{
                        '& .MuiBox-root': {
                            height: "100vh"
                        }
                    }}
                >
                    {list('right')}
                </Drawer>
            </React.Fragment>
        </div>
    );
};

export default ScoutingHeader;
