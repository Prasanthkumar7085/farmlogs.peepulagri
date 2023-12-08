import type { NextPage } from "next";
import styles from "./view-farm.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getFarmByIdService from "../../../../lib/services/FarmsService/getFarmByIdService";
import { FarmDataType } from "@/types/farmCardTypes";
import timePipe from "@/pipes/timePipe";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { useSelector } from "react-redux";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import deleteFarmService from "../../../../lib/services/FarmsService/deleteFarmService";
import AlertComponent from "@/components/Core/AlertComponent";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


const ViewFarmPage = () => {
  const router = useRouter();
  const [data, setData] = useState<FarmDataType>();
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(false);
  const [statsData, setStatsData] = useState<any>([])

  const getFarmDataById = async () => {
    setLoading(true);

    const response: any = await getFarmByIdService(router.query.farm_id as string, accessToken as string);

    if (response?.success) {
      setData(response?.data);
    }
    setLoading(false);
  }

  const getStatsCount = async () => {
    setLoading(true)
    try {
      let urls = [
        `${process.env.NEXT_PUBLIC_API_URL}/farms/${router.query.farm_id}/crops-count`,
        `${process.env.NEXT_PUBLIC_API_URL}/farms/${router.query.farm_id}/images-count`,
      ];
      let tempResult: any = [];

      const responses = await Promise.allSettled(
        urls.map(async (url) => {
          const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
              authorization: accessToken,
            }),
          });
          return response.json();
        })
      );

      responses.forEach((result, num) => {
        if (result.status === "fulfilled") {
          tempResult.push(result.value);
        }
        if (result.status === "rejected") {
        }
      });
      console.log(tempResult, "klo")
      setStatsData(tempResult)
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)

    }
  }

  useEffect(() => {
    if (router.isReady && accessToken) {
      getFarmDataById();
      getStatsCount();
    }
  }, [router.isReady, accessToken]);
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

  // Crop.svg
  return (
    <div>
      <div className={styles.header} id="header">
        <img
          className={styles.iconsiconArrowLeft}
          alt=""
          src="/iconsiconarrowleft.svg"
          onClick={() => router.back()}
        />
        <Typography className={styles.viewFarm}>Farm Details</Typography>
        <div className={styles.headericon} id="header-icon" onClick={handleClick}>
        </div>

      </div>
      {!loading ? (
        <div className={styles.viewFarmDetailsCard}>
          <div className={styles.overViewBtns}>
            <div className={styles.farmOverView} style={{ background: "#D94841" }}>
              <img src="/mobileIcons/farms/Crop.svg" alt="" width={"24px"} />
              <div className={styles.overViewText}>
                <h6>{statsData[0]?.data}</h6>
                <span>Crops</span>
              </div>
            </div>
            <div className={styles.farmOverView} style={{ background: "#05A155" }}>
              <img src="/mobileIcons/farms/image-fill.svg" alt="" width={"24px"} />
              <div className={styles.overViewText}>
                <h6>{statsData[1]?.data}</h6>
                <span>Images</span>
              </div>
            </div>
          </div>
          <div className={styles.viewfarmCard} id="view-farm">
            <Box className={styles.farmdetailsblock}>
              <div className={styles.iconBlock} >
                <div onClick={handleClick}>
                  < MoreHorizIcon sx={{ fontSize: "2rem" }} />
                </div>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}

                  sx={{
                    '& .MuiMenuItem-root': {
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      minHeight: "inherit",

                    }
                  }}
                >
                  <MenuItem sx={{ borderBottom: "1px solid #B4C1D6" }} onClick={() => { handleClose(); router.push(`/farms/${router.query.farm_id}/edit`) }}> <ModeEditOutlinedIcon sx={{ fontSize: "16px" }} />Edit</MenuItem>
                  <MenuItem onClick={() => { setDialogOpen(true); setAnchorEl(null) }}><DeleteOutlinedIcon sx={{ fontSize: "16px" }} />Delete</MenuItem>

                </Menu>
              </div>
              <div className={styles.eachFarmDetails} >
                <div className={styles.detailsHeading}>
                  <img src="/mobileIcons/farms/farm-view-mobile.svg" alt="" width={"20px"} />
                  <span>Title</span>
                </div>
                <div className={styles.aboutFarm}>
                  {data?.title}
                </div>
              </div>
              <div className={styles.eachFarmDetails}>
                <div className={styles.detailsHeading}>
                  <img src="/mobileIcons/farms/field-icon.svg" alt="" width={"20px"} />
                  <span> Acres</span>

                </div>
                <div className={styles.aboutFarm}>
                  {data?.area ? Math.floor(data?.area * 100) / 100 : ""}
                </div>

              </div>
              <div className={styles.eachFarmDetails} >
                <div className={styles.detailsHeading}>
                  <img src="/mobileIcons/farms/map-pin-line-view.svg" alt="" width={"20px"} />
                  <span>  Location</span>

                </div>
                <div className={styles.aboutFarm}>
                  {data?.location_id?.title ? ' ' + data?.location_id?.title : " N/A"}
                </div>

              </div>
              <div className={styles.eachFarmDetails} >
                <div className={styles.detailsHeading}>
                  <img src="/mobileIcons/farms/calendar-blank.svg" alt="" width={"20px"} />
                  <span>Created On</span>

                </div>
                <div className={styles.aboutFarm}>
                  {timePipe(data?.createdAt as string, 'DD, MMM YYYY')}
                </div>

              </div>
            </Box>
          </div>
        </div>
      ) : (
        ""
      )}
      <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} mobile={true} />

      <LoadingComponent loading={loading} />
      <AlertDelete open={dialogOpen} deleteFarm={deleteFarm} setDialogOpen={setDialogOpen} loading={loading} />

    </div>
  );
};

export default ViewFarmPage;
