import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { setCropTitleTemp } from "@/Redux/Modules/Farms";
import NewFolderDiloag from "@/components/Core/AddCropalert/AddNewFolder";
import AlertComponent from "@/components/Core/AlertComponent";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import timePipe from "@/pipes/timePipe";
import { CropTypeResponse } from "@/types/cropTypes";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import deleteCropService from "../../../../lib/services/CropServices/deleteCropService";
import updateCropService from "../../../../lib/services/CropServices/updateCropService";
import styles from "./crop-card.module.css";

interface pagePropsType {
  itemDetails: CropTypeResponse;
  getCropsDetails: (farmId: string) => void;
  colorIndex: number;
}
const CropCard = ({
  itemDetails,
  getCropsDetails,
  colorIndex,
}: pagePropsType) => {
  const router = useRouter();
  // const id = router.query.farm_id
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

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
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiMenuItem-root": {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            minHeight: "inherit",
          },
        }}
      >
        <MenuItem
          sx={{ borderBottom: "1px solid #B4C1D6" }}
          onClick={() => {
            handleClose();
            setRenameOpen(true);
          }}
        >
          {" "}
          <ModeEditOutlinedIcon sx={{ fontSize: "16px" }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteOpen(true);
            handleClose();
          }}
        >
          <DeleteOutlinedIcon sx={{ fontSize: "16px" }} />
          Delete
        </MenuItem>
      </Menu>
    );
  };

  const captureResponseDilog = (value: any, index: number) => {
    setErrorMessages([]);
    if (!value) {
      setRenameOpen(false);
    } else {
      const { title, crop_area } = value;

      let obj = {
        title: title ? title?.trim() : "",
        crop_area: crop_area,
      };
      renameCrop(obj);
    }
  };

  const [loadingForAdd, setLoadingForAdd] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const logout = async () => {
    try {
      removeCookie("userType");
      loggedIn("loggedIn");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };

  const renameCrop = async (value: any) => {
    setLoadingForAdd(true);
    const response = await updateCropService(
      router.query.farm_id as string,
      itemDetails?._id,
      value,
      accessToken
    );
    if (response?.success) {
      getCropsDetails(router.query.farm_id as string);
      setAlertMessage(response?.message);
      setAlertType(true);
      setRenameOpen(false);
    } else if (response?.status == 422) {
      setErrorMessages(response?.errors);
    } else if (response?.statusCode == 403) {
      await logout();
    } else {
      setAlertMessage(response?.message);
      setAlertType(false);
    }
    setLoadingForAdd(false);
  };

  const deleteCrop = async () => {
    setDeleteLoading(true);
    const response = await deleteCropService(
      router.query.farm_id as string,
      itemDetails?._id,
      accessToken
    );
    if (response?.success) {
      getCropsDetails(router.query.farm_id as string);
      setAlertMessage(response?.message);
      setAlertType(true);
      setDeleteOpen(false);
    } else if (response?.statusCode == 403) {
      await logout();
    } else {
      setAlertMessage(response?.message);
      setAlertType(false);
    }

    setDeleteLoading(false);
  };
  const setToStorage = async (title: string) => {
    await dispatch(setCropTitleTemp(title));
    router.push(`/farms/${router.query.farm_id}/crops/${itemDetails._id}`);
  };

  let colorsArray = [
    "#ffcc99",
    "#ffccff",
    "#ffcccc",
    "#ccffff",
    "#ccffcc",
    "#ccccff",
    "#99ffff",
    "#99ffcc",
    "#99ccff",
    "#c0c0ff",
    "#f6cff1",
    "#d5dae9",
    "#e9e9e9",
    "#e1dbde",
    "#fac2d9",
    "#fac2d9",
    "#cae9f6",
    "#d3d3f4",
    "#dbdfee",
    "#e8f3d0",
    "#f9e8c6",
    "#d0ffff",
    "#d0ffff",
    "#d5ebed",
  ];

  return (
    <div className={styles.folder}>
      <div className={styles.cropcard}>
        <div className={styles.icons}>
          <Avatar
            sx={{ bgcolor: colorsArray[colorIndex], color: "black !important" }}
            className={styles.avatarImage}
          >
            {itemDetails?.title.toUpperCase().slice(0, 2)}
          </Avatar>
          <div
            className={styles.textWrapper}
            onClick={() => setToStorage(itemDetails?.title)}
          >
            <h2 className={styles.FieldCrop}>
              {itemDetails?.title.length > 12
                ? itemDetails?.title.slice(0, 1).toUpperCase() +
                  itemDetails?.title.slice(1, 9) +
                  "..."
                : itemDetails?.title.slice(0, 1).toUpperCase() +
                  itemDetails?.title.slice(1)}
            </h2>
            <p className={styles.aug2023}>
              {timePipe(itemDetails.created_at, "DD, MMM YYYY")}
            </p>
          </div>

          <MenuItemsForFolder />
        </div>
        <div className={styles.actionButtons}>
          <p className={styles.aug2023}>
            {itemDetails.area
              ? itemDetails.area + (itemDetails.area < 2 ? " acre" : " acres")
              : 0 + " acres"}
          </p>
          <Button
            className={styles.button}
            onClick={() => {
              handleClose();
              setRenameOpen(true);
            }}
          >
            <ModeEditOutlinedIcon sx={{ fontSize: "16px", color: "#ff4444" }} />
          </Button>
          <Button
            className={styles.button}
            onClick={() => {
              setDeleteOpen(true);
              handleClose();
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: "16px", color: "#555555" }} />
          </Button>
        </div>
      </div>
      {renameOpen ? (
        <NewFolderDiloag
          open={renameOpen}
          captureResponseDilog={captureResponseDilog}
          loading={loadingForAdd}
          defaultTitle={itemDetails?.title}
          defaultArea={itemDetails?.area}
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
