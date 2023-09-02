import type { NextPage } from "next";
import styles from "./side-bar-menu.module.css";
import { FC, ReactNode } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from "@mui/material";
import getAllFarmsService from "../../../lib/services/FarmsService/getAllFarmsService";
import { useSelector } from "react-redux";



interface MyProps {
    children?: ReactNode;
}

interface item {
    src: string;
    link: string;
    isVisible: boolean;
}


const SideBarMenu = ({ children }: any) => {

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    const userName = useSelector((state: any) => state.auth.userDetails?.user_details?.user_type);

    const router = useRouter();

    const menuListItems = [
        { src: '/dashboard-icon.svg', link: `/farm`, isVisible: userName !== 'ADMIN' },
        { src: '/support-icon.svg', link: "/support", isVisible: true },
        { src: '/timeline-icon.svg', link: "/timeline", isVisible: userName !== 'ADMIN' },
        // { src: '/settings-icon.svg', link: "/" },
        // { src: '/calendaricon.svg', link: "/" },
        // { src: '/graph-icon.svg', link: "/" },
    ]


    const logout = async () => {
        try {
            const response = await fetch('/api/remove-cookie');
            if (response.status) {
                router.replace('/');
            } else throw response;

        } catch (err: any) {
            console.error(err);

        }
    }
    return (
        <div>
            <aside className={styles.sidebarmenu}>
                <Image className={styles.logoIcon} alt="" src="/logo.svg" width={20} height={20} />
                <nav className={styles.menubar}>
                    <List>
                        {menuListItems.map((item: item, index: number) => {
                            console.log(item.isVisible);

                            if (item.isVisible) {
                            return (
                                <ListItem className={styles.menuItem} key={index}>
                                    <ListItemButton onClick={() => router.replace(item.link)}>
                                        <Image className={styles.apps1Icon} alt="" src={item.src} width={20} height={20} />
                                    </ListItemButton>
                                </ListItem>
                            )
                            }
                        })}
                    </List>
                    <IconButton onClick={logout}>
                        <LogoutIcon sx={{ color: "white" }} />
                    </IconButton>
                </nav>


                <button className={styles.profile}>
                    <div className={styles.profile1}>
                        <Image src={'/user-avatar.svg'} className={styles.profileChild} alt="" width={20} height={20} />
                    </div>
                </button>
            </aside>
            <div className={styles.main}>
                {children}
            </div>
        </div>
    );
};

export default SideBarMenu;
