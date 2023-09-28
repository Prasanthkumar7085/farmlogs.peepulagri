import styles from "./crop-card.module.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import timePipe from "@/pipes/timePipe";
import { useRouter } from "next/router";
import { CropTypeResponse } from "@/types/cropTypes";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import NewFolderDiloag from "@/components/Core/AddCropalert/AddNewFolder";
import updateCropService from "../../../../lib/services/CropServices/updateCropService";
import { useSelector } from "react-redux";
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import deleteCropService from "../../../../lib/services/CropServices/deleteCropService";
import AlertComponent from "@/components/Core/AlertComponent";

interface pagePropsType {
    itemDetails: CropTypeResponse;
    getCropsDetails: (farmId: string) => void;
}
const CropCard = ({ itemDetails, getCropsDetails }: pagePropsType) => {

    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [renameOpen, setRenameOpen] = useState(false);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const MenuItemsForFolder = () => {
        return (
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                sx={{
                    '& .MuiMenuItem-root': {
                        display: "flex", alignItems: "center", gap: "0.5rem",
                        minHeight: "inherit",

                    }
                }}
            >
                <MenuItem onClick={() => { handleClose(); setRenameOpen(true) }}>Rename</MenuItem>
                <MenuItem onClick={() => { setDeleteOpen(true); handleClose() }}>Delete</MenuItem>
        
            </Menu>
        )
    }

    const captureResponseDilog = (value: any) => {
        if (value == false) {
            setRenameOpen(false)
        }
        else {
            renameCrop(value);
        }
    }


    const [loadingForAdd, setLoadingForAdd] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);

    const renameCrop = async (value: any) => {
        setLoadingForAdd(true)
        const response = await updateCropService(router.query.farm_id as string, itemDetails?._id, value, accessToken);
        if (response?.success) {
            getCropsDetails(router.query.farm_id as string);
            setAlertMessage(response?.message);
            setAlertType(true)
        } else {
            setAlertMessage(response?.message);
            setAlertType(false)
        }
        setRenameOpen(false);
        setLoadingForAdd(false);
    }

    const deleteCrop = async() => {
        setDeleteLoading(true)
        const response = await deleteCropService(router.query.farm_id as string, itemDetails?._id, accessToken);
        if (response?.success) {
            getCropsDetails(router.query.farm_id as string);
            setAlertMessage(response?.message);
            setAlertType(true);
            setDeleteOpen(false);
        } else {
            setAlertMessage(response?.message);
            setAlertType(false)
        }
        setRenameOpen(false);
        setDeleteLoading(false);
    }

    return (
        <div>
            <div className={styles.cropcard} >
                <div className={styles.icons}>
                    <img className={styles.folderIcon} alt="" src="/folder.svg" onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${itemDetails._id}`)} />
                    <MoreVertIcon sx={{ color: "#FFB110", fontSize: "1.5rem" }} onClick={(event: any) => setAnchorEl(event.currentTarget)} />
                    <MenuItemsForFolder />
                </div>
                <div className={styles.textWrapper} onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${itemDetails._id}`)} >
                    <h2 className={styles.FieldCrop}>{itemDetails.title}</h2>
                    <p className={styles.aug2023}>{timePipe(itemDetails.createdAt, "DD-MM-YYYY")}</p>
                </div>
            </div>
            <NewFolderDiloag open={renameOpen} captureResponseDilog={captureResponseDilog} loading={loadingForAdd} defaultTitle={itemDetails?.title} />
            <AlertDelete open={deleteOpen} deleteFarm={deleteCrop} setDialogOpen={setDeleteOpen} loading={deleteLoading} />
            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} mobile={true} />
        </div>
    );
};

export default CropCard;
