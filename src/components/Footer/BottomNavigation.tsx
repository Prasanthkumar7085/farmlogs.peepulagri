import * as React from 'react';
import Paper from '@mui/material/Paper';
import styles from "../styles/footer.module.scss";
import HomeIcon from '@mui/icons-material/Home';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useRouter } from 'next/router';
import { Button } from "@mui/material";

export default function FixedBottomNavigation() {
    const router = useRouter()
    return (<div className={styles.footer}>
        <Paper className={styles.footerCard} sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: "0 !important"
        }}>
            <div className={styles.navButtonList}>
                <Button className={router.pathname.includes("/dashboard") ? styles.navButtonActive : styles.navButton}
                    sx={{ color: 'black' }} onClick={() => router.push("/dashboard")}><HomeIcon />Dashboard</Button>
                <Button className={router.pathname.includes("/buses") ? styles.navButtonActive : styles.navButton}
                    sx={{ color: 'black' }} onClick={() => router.push("/buses")}><DirectionsBusIcon />Buses</Button>
                <Button
                    className={router.pathname.includes("/donate") ? styles.navButtonCurrencyActive : styles.navButtonCurrency}
                    sx={{ color: 'black' }} onClick={() => router.push("/donate")}><CurrencyRupeeIcon />Donate</Button>
                <Button className={router.pathname.includes("/donations") ? styles.navButtonActive : styles.navButton}
                    sx={{ color: 'black' }} onClick={() => router.push("/donations")}><PaymentsIcon />Donations</Button>
                <Button className={router.pathname.includes("/profile") ? styles.navButtonActive : styles.navButton}
                    sx={{ color: 'black' }} onClick={() => router.push("/profile")}><AccountCircleIcon />My Profile</Button>
            </div>

        </Paper>
    </div>);
}

