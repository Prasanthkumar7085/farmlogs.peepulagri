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


interface MyProps {
    children?: ReactNode;
}

interface item {
    src: string;
    link: string
}

const menuListItems = [
    { src: '/dashboard-icon.svg', link: "/" },
    { src: '/support-icon.svg', link: "/support" },
    { src: '/timeline-icon.svg', link: "/timeline" },
    { src: '/settings-icon.svg', link: "/" },
    { src: '/calendaricon.svg', link: "/" },
    { src: '/graph-icon.svg', link: "/" },
]

const SideBarMenu = ({ children }: any) => {
    const router = useRouter();


    const logout = async () => {
        try {
            const response = await fetch('/api/remove-cookie');
            if (response.status) {
                router.push('/');
            } else throw response;

        } catch (err: any) {
            console.error(err);

        }
    }
    return (
        <div>
            <aside className={styles.sidebarmenu}>
                <Link href={`/farm/${router.query.farm_id}/logs`} className={styles.logo}>
                    <Image className={styles.logoIcon} alt="" src="/logo.svg" width={20} height={20} />
                </Link>
                <nav className={styles.menubar}>
                    <List>
                        {menuListItems.map((item: item, index: number) => {
                            return (
                                <ListItem className={styles.menuItem} key={index}>
                                    <ListItemButton onClick={() => router.push(item.link)}>
                                        <Image className={styles.apps1Icon} alt="" src={item.src} width={20} height={20} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                </nav>

                <IconButton onClick={logout}>
                    <LogoutIcon sx={{ color: "white" }} />
                </IconButton>

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
