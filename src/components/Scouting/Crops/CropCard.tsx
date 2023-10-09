import styles from "./crop-card.module.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import timePipe from "@/pipes/timePipe";
import { useRouter } from "next/router";
import { CropTypeResponse } from "@/types/cropTypes";
import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import NewFolderDiloag from "@/components/Core/AddCropalert/AddNewFolder";
import updateCropService from "../../../../lib/services/CropServices/updateCropService";
import { useDispatch, useSelector } from "react-redux";
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import deleteCropService from "../../../../lib/services/CropServices/deleteCropService";
import AlertComponent from "@/components/Core/AlertComponent";
import { setCropTitleTemp } from "@/Redux/Modules/Farms";

interface pagePropsType {
    itemDetails: CropTypeResponse;
    getCropsDetails: (farmId: string) => void;
}
const CropCard = ({ itemDetails, getCropsDetails }: pagePropsType) => {

    const router = useRouter();
    const dispatch = useDispatch();

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
                <MenuItem sx={{ borderBottom: "1px solid #B4C1D6" }} onClick={() => { handleClose(); setRenameOpen(true) }}> <ModeEditOutlinedIcon sx={{ fontSize: "16px" }} />Edit</MenuItem>
                <MenuItem  onClick={() => { setDeleteOpen(true); handleClose() }}><DeleteOutlinedIcon sx={{ fontSize: "16px" }} />Delete</MenuItem>

            </Menu>
        )
    }

    const captureResponseDilog = (value: any) => {
        setErrorMessages([]);
        if (!value) {
            setRenameOpen(false)
        }
        else {
            const { title, crop_area } = value;
            
            let obj = {
                title: title ? title?.trim() : "",
                crop_area: (crop_area && +crop_area) ? crop_area : null
            }
            renameCrop(obj);
        }
    }


    const [loadingForAdd, setLoadingForAdd] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    const renameCrop = async (value: any) => {
        setLoadingForAdd(true)
        const response = await updateCropService(router.query.farm_id as string, itemDetails?._id, value, accessToken);
        if (response?.success) {
            getCropsDetails(router.query.farm_id as string);
            setAlertMessage(response?.message);
            setAlertType(true)
            setRenameOpen(false);
        } else if (response?.status == 422) {
            setErrorMessages(response?.errors);
        }else {
            setAlertMessage(response?.message);
            setAlertType(false)
        }
        setLoadingForAdd(false);
    }

    const deleteCrop = async () => {
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

        setDeleteLoading(false);
    }
    const setToStorage = async (title: string) => {
        await dispatch(setCropTitleTemp(title));
        router.push(`/farms/${router.query.farm_id}/crops/${itemDetails._id}`)
    }

    return (
      <div className={styles.folder}>
        <div className={styles.cropcard}>
          <div className={styles.icons}>
            <img
              className={styles.folderIcon}
              alt=""
              src="/folder.svg"
              onClick={() => setToStorage(itemDetails?.title)}
            />
            <MoreVertIcon
              sx={{ color: "#FFB110", fontSize: "1.5rem" }}
              onClick={(event: any) => setAnchorEl(event.currentTarget)}
            />
            <MenuItemsForFolder />
          </div>
          <div
            className={styles.textWrapper}
            onClick={() => setToStorage(itemDetails?.title)}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                            justifyContent: "space-between",
                alignItems:"center"
              }}
            >
              <h2 className={styles.FieldCrop}>
                {itemDetails?.title.length > 15
                  ? itemDetails?.title.slice(0, 12) + "..."
                  : itemDetails?.title}
              </h2>
              <p className={styles.aug2023} >
                {timePipe(itemDetails.createdAt,'DD, MMM YYYY')}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                width: "95%",
                justifyContent: "space-between",
              }}
            >
              <p className={styles.aug2023}>Crop Area</p>
              <p className={styles.aug2023}>
                {itemDetails.crop_area
                  ? itemDetails.crop_area +
                    (itemDetails.crop_area < 2 ? " acre" : " acres")
                  : 0 + " acres"}
              </p>
            </div>
          </div>
        </div>
        {renameOpen ? (
          <NewFolderDiloag
            open={renameOpen}
            captureResponseDilog={captureResponseDilog}
            loading={loadingForAdd}
            defaultTitle={itemDetails?.title}
            defaultArea={itemDetails?.crop_area}
            errorMessages={errorMessages}
          />
        ) : (
          ""
        )}
        {deleteOpen ? (
          <AlertDelete
            open={deleteOpen}
            deleteFarm={deleteCrop}
            setDialogOpen={setDeleteOpen}
            loading={deleteLoading}
          />
        ) : (
          ""
        )}
        {alertMessage ? (
          <AlertComponent
            alertMessage={alertMessage}
            alertType={alertType}
            setAlertMessage={setAlertMessage}
            mobile={true}
          />
        ) : (
          ""
        )}
      </div>
    );
};

export default CropCard;
