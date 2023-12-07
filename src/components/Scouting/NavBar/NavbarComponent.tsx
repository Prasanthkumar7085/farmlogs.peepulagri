// import styles from "./navbar.module.css";
// import ImageComponent from "@/components/Core/ImageComponent";
// import { IconButton } from "rsuite";
// import React, { useState } from "react";
// import { Box, Drawer } from "@mui/material";
// import SideMenu1 from "./side-menu1";
// import { useRouter } from "next/router";

// type Anchor =  'right';

// const ScoutingHeader = ({ children }: any) => {
//     const router = useRouter();
//     const [state, setState] = useState({ right: false });

//     const toggleDrawer = (open: boolean) => {
//         setState({ ...state, 'right': open });
//     };


//     const list = (anchor: Anchor) => (
//         <Box
//             sx={{ width: '100%' }}
//             role="presentation"
//         >
//             <SideMenu1 toggleDrawer={toggleDrawer} />
//         </Box>
//     );

//     return (
//         <div id="mobileBody">
//             <div id={styles.navBar}>
//                 <div className={styles.navbar}>
//                     <ImageComponent onClick={() => router.push('/farms')} src="/Logo-color.svg" width="70" height="60" />
//                     <IconButton onClick={() => toggleDrawer(true)}>
//                         <img className={styles.menuIicon} alt="options" src="/menuiicon.svg" />
//                     </IconButton>
//                 </div>
//             </div>
//             {children}
//             <React.Fragment>
//                 <Drawer
//                     anchor={'right'}
//                     open={state['right']}
//                     sx={{
//                         '& .MuiBox-root': {
//                             height: "100vh"
//                         }
//                     }}
//                 >
//                     {list('right')}
//                 </Drawer>
//             </React.Fragment>
//         </div>
//     );
// };

// export default ScoutingHeader;
import * as React from 'react';
import Paper from '@mui/material/Paper';
import styles from "./footer.module.scss";
import HomeIcon from '@mui/icons-material/Home';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';
import { Button } from "@mui/material";

export default function ScoutingHeader({ children }: any) {
    const router = useRouter()
    return (<div className={styles.footer}>
        {children}
        <Paper className={styles.footerCard} sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: "0 !important"
        }}>

            <div className={styles.navButtonList}>
                <Button className={router.pathname.includes("/dashboard") ? styles.navButtonActive : styles.navButton}
                    sx={{ color: 'black' }} onClick={() => router.push("/dashboard")}>{router.pathname.includes("/dashboard") ? <img src="./mobileIcons/navTabs/dashboard-mobile-active.svg" alt="" /> : <img src="./mobileIcons/navTabs/dashboard-mobile.svg" alt="" width={"25px"} />} Dashboard</Button>

                <Button className={router.pathname.includes("/farms") ? styles.navButtonActive : styles.navButton}
                    sx={{ color: 'black' }} onClick={() => router.push("/farms")}>{router.pathname.includes("/farms") ? <img src="./mobileIcons/navTabs/farms-mobile-active.svg" alt="" /> : <img src="./mobileIcons/navTabs/farms-mobile.svg" alt="" width={"25px"} />} Farms</Button>

                <Button
                    className={router.pathname.includes("/summary") ? styles.navButtonActive : styles.navButton}
                    sx={{ color: 'black' }} onClick={() => router.push("/summary")}>{router.pathname.includes("/summary") ? <img src="./mobileIcons/navTabs/summary-mobile-active.svg" alt="" /> : <img src="./mobileIcons/navTabs/summary-mobile.svg" alt="" width={"25px"} />} Summary</Button>

                <Button className={router.pathname.includes("/profile") ? styles.navButtonActive : styles.navButton}
                    sx={{ color: 'black' }} onClick={() => router.push("/profile")}>{router.pathname.includes("/profile") ? <img src="./mobileIcons/navTabs/profile-mobile-active.svg" alt="" /> : <img src="./mobileIcons/navTabs/profile-mobile.svg" alt="" width={"25px"} />} My Profile</Button>
            </div>

        </Paper>

    </div>);
}


