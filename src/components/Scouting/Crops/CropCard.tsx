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


interface pagePropsType{
    itemDetails: CropTypeResponse;
    getCropsDetails: (farmId: string) => void;
}
const CropCard = ({ itemDetails,getCropsDetails }: pagePropsType) => {
    
    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);
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
            >
                <MenuItem onClick={() => { handleClose(); setRenameOpen(true) }}>Rename</MenuItem>
                <MenuItem onClick={() => { setMenuOpen(true); setAnchorEl(null) }}>Delete</MenuItem>
        
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

    const renameCrop = async (value: any) => {
        setLoadingForAdd(true)
        const response = await updateCropService(router.query.farm_id as string, itemDetails?._id, value, accessToken);
        if (response?.success) {
            getCropsDetails(router.query.farm_id as string);
        }
        setRenameOpen(false);
        setLoadingForAdd(false);
    }

    return (
        <div>
            <div className={styles.cropcard} >
                <div className={styles.icons}>
                    <img className={styles.folderIcon} alt="" src="/folder.svg"  onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${itemDetails._id}`)} />
                    <MoreVertIcon sx={{ color: "#FFB110", fontSize: "1.5rem" }} onClick={(event:any)=>setAnchorEl(event.currentTarget)} />
                    <MenuItemsForFolder />
                </div>
                <div className={styles.textWrapper}  onClick={() => router.push(`/farms/${router.query.farm_id}/crops/${itemDetails._id}`)} >
                    <h2 className={styles.FieldCrop}>{itemDetails.title}</h2>
                    <p className={styles.aug2023}>{timePipe(itemDetails.createdAt, "DD-MM-YYYY")}</p>
                </div>
            </div>
            <NewFolderDiloag open={renameOpen} captureResponseDilog={captureResponseDilog} loading={loadingForAdd} defaultTitle={itemDetails?.title} />
        </div>
    );
};

export default CropCard;
