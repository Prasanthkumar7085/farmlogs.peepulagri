import type { NextPage } from "next";
import styles from "./side-bar-menu.module.css";
import { FC, ReactNode } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";


interface MyProps {
    children?: ReactNode;
}

interface item {
    src: string;
    link: string
}

const menuListItems = [
    { src: '/apps-1.svg', link: "/" },
    { src: '/lifering-1.svg', link: "/support" },
    { src: '/timehalfpast-1-1.svg', link: "/timeline" },
    { src: '/settings-12.svg', link: "/" },
    { src: '/calendar-1-12.svg', link: "/" },
    { src: '/charthistogram-1.svg', link: "/" },
]

const SideBarMenu = ({ children }: any) => {
    const router = useRouter();

    return (
        <div>
            <aside className={styles.sidebarmenu}>
                <Link href={'/farm/1/logs'} className={styles.logo}>
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
                <button className={styles.profile}>
                    <div className={styles.profile1}>
                        <Image src={'/charthistogram-1.svg'} className={styles.profileChild} alt="" width={20} height={20} />
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
