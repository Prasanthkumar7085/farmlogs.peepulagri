import { useState } from "react";
import styles from "./FarmDetailsCard.module.css";
import { IconButton } from "@mui/material";
import { FarmDataType } from "@/types/farmCardTypes";
import LoadingComponent from "@/components/Core/LoadingComponent";
import timePipe from "@/pipes/timePipe";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import deleteFarmService from "../../../../lib/services/FarmsService/deleteFarmService";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import AlertComponent from "@/components/Core/AlertComponent";
import SettingsIcon from '@mui/icons-material/Settings';
import { setFarmTitleTemp } from "@/Redux/Modules/Farms";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";

interface PageProps {
  data: any;
  onViewClick: any;
  getFarmsData: ({
    search_string,
    location,
    userId,
    page,
    limit,
    sortBy,
    sortType,
  }: {
    search_string: string;
    location: string;
    userId: string;
    page: number | string;
    limit: number | string;
    sortBy: string;
    sortType: string;
  }) => void;
}
const ScoutingFarmDetailsCard = ({
  getFarmsData,
  data,
  onViewClick,
}: PageProps) => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const userType = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const responseUserType = await fetch("/api/remove-cookie");
      if (responseUserType) {
        const responseLogin = await fetch("/api/remove-cookie");
        if (responseLogin.status) {
          router.push("/");
        } else throw responseLogin;
      }
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };

  const deleteFarm = async () => {
    setDeleteLoading(true);

    const response = await deleteFarmService(deleteId, accessToken);

    if (response.success) {
      setAlertMessage(response?.message);
      setAlertType(true);
      setDeleteDialogOpen(false);
      getFarmsData({
        search_string: router.query?.search_string as string,
        location: router.query.location as string,
        userId: router.query.user_id as string,
        page: router.query.page as string,
        limit: router.query.limit as string,
        sortBy: router.query.order_by as string,
        sortType: router.query.sort_type as string,
      });
    } else if (response?.statusCode == 403) {
      await logout();
    } else {
      setAlertMessage(response?.message);
      setAlertType(false);
    }
    setDeleteLoading(false);
  };

  const setToStorage = async (item: any) => {
    await dispatch(setFarmTitleTemp(item?.title));
    router.push(`/farm/${item?._id}/crops`);
  };

  let colorsArray = [
    "#C71585",
    "#7B68EE",
    "#FF8C00",
    " #008080",
    "#2E8B57",
    "#4682B4",
    "#000080",
    "#3D3D5B",
    " #CC0044",
    "#BA55D3",
    "#663399",
    "#8B0000",
    "#FF4500",
    "#DA0E0E",
    "#00CED1",
    "#4169E1",
    " #A52A2A",
    "#2D1E2F",
    "#714E47",
    "#C65B7C",
    "#A04662",
    "#FE654F",
    " #5F6A89",
    "#067BBD",
  ];

  return (
    <div className={styles.farmCardGridContainer}>
      {data.map((item: FarmDataType, index: number) => {
        const colorIndex = index % colorsArray.length;

        return (
          <div
            className={styles.farmdetailscard}
            key={index}
            style={{ cursor: "pointer" }}
          >
            <div
              className={styles.container}
              onClick={() => setToStorage(item)}
            >
              <div className={styles.farmdetailscontainer}>
                <div className={styles.farmName}>
                  <img
                    className={styles.farmsIcon}
                    alt="Farm Shape"
                    src="/farmshape2.svg"
                  />
                  <h2
                    className={styles.farm1}
                    style={{ color: colorsArray[colorIndex] }}
                  >
                    {item.title.length > 16
                      ? item.title.slice(0, 1).toUpperCase() +
                      item.title.slice(1, 12) +
                      "..."
                      : item.title[0].toUpperCase() + item.title.slice(1)}
                  </h2>
                </div>
                <div className={styles.landdetails}>
                  <p className={styles.totalAcres}>
                    Total <span>(acres)</span>
                  </p>
                  <p className={styles.text}>{item.area}</p>
                </div>
              </div>
              <div className={styles.timeline}>
                <img
                  className={styles.calendarIcon}
                  alt=""
                  src="/farm-date-icon.svg"
                />
                <div className={styles.duration}>
                  <p className={styles.from}>
                    {timePipe(item.created_at, "DD, MMM YYYY")}
                  </p>
                  <p className={styles.divider}>-</p>
                  <p className={styles.from}>Current</p>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div onClick={() => router.push(`/farm/${item?._id}/crops`)}>
                {userType == "AGRONOMIST" ? (
                  <p className={styles.mobile}>
                    <AccountCircleIcon />
                    <span>{item?.user_id?.full_name}</span>
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.actionbuttons}>
                <IconButton
                  className={styles.view}
                  onClick={() => onViewClick(item._id)}
                >
                  <SettingsIcon sx={{ color: "#6A7185" }} />
                </IconButton>
                {/* <IconButton className={styles.edit}>
                  <img
                    className={styles.trashXmark1Icon}
                    alt=""
                    src="/edit-farm-icon.svg"
                  />
                </IconButton> */}
                {/* <IconButton className={styles.delete} onClick={() => { setDeleteDialogOpen(true); setDeleteId(item._id)}}>
                  <img
                    className={styles.trashXmark1Icon}
                    alt=""
                    src="/farm-delete-icon.svg"
                  />
                </IconButton> */}
              </div>
            </div>
          </div>
        );
      })}

      <AlertDelete
        deleteFarm={deleteFarm}
        setDialogOpen={setDeleteDialogOpen}
        open={deleteDialogOpen}
        loading={deleteLoading}
      />
      <AlertComponent
        alertMessage={alertMessage}
        setAlertMessage={setAlertMessage}
        alertType={alertType}
      />
    </div>
  );
};

export default ScoutingFarmDetailsCard;
