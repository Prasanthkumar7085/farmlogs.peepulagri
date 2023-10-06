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
import { setCropTitleTemp, setFarmTitleTemp } from "@/Redux/Modules/Farms";


interface PageProps {
  data: any;
  onViewClick: any;
  loading: boolean;
  getFarmsData: ({ search_string, location }: { search_string: string, location: string }) => void
}
const ScoutingFarmDetailsCard = ({ getFarmsData, data, onViewClick, loading }: PageProps) => {

  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(false);
  const dispatch = useDispatch();

  const deleteFarm = async () => {
    setDeleteLoading(true);

    const response = await deleteFarmService(deleteId, accessToken);

    if (response.success) {
      setAlertMessage(response?.message);
      setAlertType(true);
      setDeleteDialogOpen(false);
      getFarmsData({ search_string: router.query?.search_string as string, location: router.query.location as string })

    } else {
      setAlertMessage(response?.message);
      setAlertType(false);
    }
    setDeleteLoading(false);
  };


  const setToStorage = async (item: any) => {
    await dispatch(setFarmTitleTemp(item?.title));
    router.push(`/farm/${item?._id}/crops`)
  }

  return (
    <div className={styles.farmCardGridContainer}>
      {data.map((item: FarmDataType, index: number) => {
        return (
          <div className={styles.farmdetailscard} key={index} style={{ cursor: "pointer" }}>
            <div className={styles.container} onClick={() => setToStorage(item)}>
              <div className={styles.farmdetailscontainer}>
                <div className={styles.farmName}>
                  <img className={styles.farmsIcon} alt="" src="/farmshape2.svg" />
                  <h2 className={styles.farm1}>
                    {item.title.length > 16 ?
                      (item.title.slice(0, 1).toUpperCase() +
                        item.title.slice(1, 12) + '...') :
                      item.title[0].toUpperCase() + item.title.slice(1,)}
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
                    {timePipe(item.createdAt, 'DD, MMM YYYY')}
                  </p>
                  <p className={styles.divider}>-</p>
                  <p className={styles.from}>
                    Current
                  </p>
                </div>
              </div>
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }} >
              <div style={{ width: "100%" }} onClick={() => router.push(`/farm/${item?._id}/crops`)}>
                {/* Testung */}
              </div>
              <div className={styles.actionbuttons} >
                <IconButton className={styles.view} onClick={() => onViewClick(item._id)}>
                  <SettingsIcon sx={{ color: "#c1c1c1" }} />
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
        )
      })}

      <AlertDelete deleteFarm={deleteFarm} setDialogOpen={setDeleteDialogOpen} open={deleteDialogOpen} loading={deleteLoading} />
      <LoadingComponent loading={loading} />
      <AlertComponent alertMessage={alertMessage} setAlertMessage={setAlertMessage} alertType={alertType} />
    </div>
  );
};

export default ScoutingFarmDetailsCard;
