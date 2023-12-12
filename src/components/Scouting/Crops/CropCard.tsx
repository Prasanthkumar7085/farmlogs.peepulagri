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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface pagePropsType {
  itemDetails: CropTypeResponse;
  getCropsDetails: (farmId: string) => void;
  colorIndex: number;
  form_Id: string;
}
const CropCard = ({
  itemDetails,
  form_Id,
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
    console.log(value);

    setErrorMessages([]);
    if (!value) {
      setRenameOpen(false);
    } else {
      const { title, crop_area } = value;

      let obj = {
        title: title ? title?.trim() : "",
        area: crop_area,
        farm_id: router.query.farm_id,
      };
      editCrop(obj);
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

  const editCrop = async (value: any) => {
    setLoadingForAdd(true);
    const response = await updateCropService(
      itemDetails?._id,
      value,
      accessToken
    );
    if (response?.success) {
      getCropsDetails(router.query.farm_id as string);
      setAlertMessage(response?.message);
      router.back()

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
    const response = await deleteCropService(itemDetails?._id, accessToken);
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
  const handleMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={styles.folder}>
      <div className={styles.cropcard}>
        <div className={styles.iconBlock}>
          <div onClick={handleMenuClick}>
            <MoreHorizIcon sx={{ fontSize: "2rem" }} />
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
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
                router.push(`/farms/${form_Id}/crops/${itemDetails?._id}/update-crop`)
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
        </div>
        <div
          className={styles.icons}
          onClick={() => setToStorage(itemDetails?.title)}
        >
          <div className={styles.cropDetailsBlock}>
            <Avatar
              sx={{
                bgcolor: "#E6F5EB",
                color: "#05A155 !important",
                fontSize: "1.2rem",
              }}
              className={styles.avatarImage}
              variant="square"
            >
              {itemDetails?.title.toUpperCase().slice(0, 1)}
            </Avatar>
            <div className={styles.textWrapper}>
              <h2 className={styles.FieldCrop}>
                {itemDetails?.title.length > 12
                  ? itemDetails?.title.slice(0, 1).toUpperCase() +
                  itemDetails?.title.slice(1, 9) +
                  "..."
                  : itemDetails?.title.slice(0, 1).toUpperCase() +
                  itemDetails?.title.slice(1)}
              </h2>
              <p className={styles.aug2023}>
                {/* {timePipe(itemDetails.createdAt, "DD, MMM YYYY")} */}
                {itemDetails.area
                  ? itemDetails.area +
                  (itemDetails.area < 2 ? " acre" : " acres")
                  : 0 + " acres"}
              </p>
            </div>
          </div>
          {/* <MenuItemsForFolder /> */}
          <img
            className={styles.avatharImg}
            alt=""
            src={
              itemDetails?.url
                ? itemDetails?.url
                : "/mobileIcons/crops/No_Image.svg"
            }
            width={"56px"}
            height={"56px"}
          />
        </div>
      </div>
      {renameOpen ? (
        <NewFolderDiloag
          open={renameOpen}
          captureResponseDilog={captureResponseDilog}
          loading={loadingForAdd}
          itemDetails={itemDetails}
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
          deleteTitleProp={"Crop"}
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
