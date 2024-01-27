import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { setFarmTitleTemp } from "@/Redux/Modules/Farms";
import AlertComponent from "@/components/Core/AlertComponent";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import timePipe from "@/pipes/timePipe";
import { FarmDataType } from "@/types/farmCardTypes";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import deleteFarmService from "../../../../lib/services/FarmsService/deleteFarmService";
import styles from "./FarmDetailsCard.module.css";
import Image from "next/image";

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
  const userType_v2 = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
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
                    alt=""
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
                  <div className={styles.acresBlock}>
                    <Image src="/scouting/acres-icon.svg" alt="" width={15} height={15} />
                    <p className={styles.text}>
                      {item.area
                        ? item.area?.toString()?.includes(".")
                          ? (+item.area)?.toFixed(2)
                          : item.area
                        : "0"} <span>Acres</span>
                    </p>
                  </div>

                  <div className={styles.timeline}>
                    <Image
                      alt=""
                      src="/scouting/farm-calender-icon.svg"
                      width={16}
                      height={16}
                    />
                    <p className={styles.from}>
                      {timePipe(item.createdAt, "DD, MMM YYYY hh:mm A")}
                    </p>

                  </div>
                </div>
              </div>

              <div className={styles.timeline}>
                <div className={styles.duration}>
                  <Image src="/location-3-1-11.svg" alt="" width={15} height={15} />
                  <p className={styles.locationTitle}>{item?.location_id?.title}</p>
                </div>
                <div className={styles.actionbuttons}>
                  <IconButton
                    className={styles.view}
                    onClick={() => {
                      router.push(`/farm/${item?._id}/crops`);
                    }}
                  >
                    <Image
                      src="/mobileIcons/farms/plant-black-icon.svg"
                      width={25}
                      height={25}
                      alt=""
                    />
                  </IconButton>
                  <IconButton
                    className={styles.farmViewBtn}
                    onClick={() => router.push(`/farm/${item?._id}`)
                    }
                  >
                    <Image
                      src="/mobileIcons/farms/info.svg"
                      width={25}
                      height={25}
                      alt=""
                    />
                  </IconButton>

                </div>
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
        deleteTitleProp={"Farm"}
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
