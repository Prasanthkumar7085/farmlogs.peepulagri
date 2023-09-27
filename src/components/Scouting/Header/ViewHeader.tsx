import styles from "./head.module.css";
import { Menu, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/router";
import {  useState } from "react";
import deleteFarmService from "../../../../lib/services/FarmsService/deleteFarmService";
import { useSelector } from "react-redux";
import AlertComponent from "@/components/Core/AlertComponent";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";


const ViewHeader = ({ name }: any) => {

    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    
    const deleteFarm = async () => {
        setLoading(true);
        handleClose();
        const response = await deleteFarmService(router.query.farm_id as string, accessToken);
        if (response?.success) {
            setAlertMessage(response?.message);
            setAlertType(true);
            setTimeout(() => {
                router.back();
            }, 600);
            
        } else {
            setAlertMessage(response?.message);
            setAlertType(false);
        }
        setLoading(false);
    };
    
    return (
        <div>
            <div className={styles.header} id="header">
            <img
                className={styles.iconsiconArrowLeft}
                alt=""
                src="/iconsiconarrowleft.svg"
                onClick={() => router.back()}
                style={{cursor:"pointer"}}
            />
            <Typography className={styles.viewFarm}>{name}</Typography>

            <div className={styles.headericon} id="header-icon" onClick={handleClick}>
                <img className={styles.headericonChild} alt="" src="/frame-40561.svg" />
            </div>
             <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={()=>router.push(`/farms/${router.query.farm_id}/edit`)}>Edit</MenuItem>
                    <MenuItem onClick={() => { setDialogOpen(true); setAnchorEl(null)}}>Delete</MenuItem>
            
            </Menu>
        </div>
            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} mobile={true}/>
            {/* <LoadingComponent loading={loading} /> */}
            <AlertDelete open={dialogOpen} deleteFarm={deleteFarm} setDialogOpen={setDialogOpen} loading={loading} />
        </div>
     
    );
};

export default ViewHeader;