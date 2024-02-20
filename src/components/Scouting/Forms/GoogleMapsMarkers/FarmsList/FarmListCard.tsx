import type { NextPage } from "next";
import { Button, Icon, IconButton } from "@mui/material";
import styles from "./farmListCard.module.css";
import timePipe from "@/pipes/timePipe";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NoDataMobileComponent from "@/components/Core/NoDataMobileComponent";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "sonner";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import deleteFarmService from "../../../../../../lib/services/FarmsService/deleteFarmService";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingComponent from "@/components/Core/LoadingComponent";
const FarmListCard = ({
  data, getFarmLocation, editPolygonDetails, setEditFarmsDetails, editFarmDetails,
  setPolygonCoords, getFarmOptions, setSelectedPolygon,
  setOpenFarmDetails,
  getFarmDataById,
  addPolyToExisting,
  farmOptionsLoading

}: any) => {

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [loading, setLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteID] = useState<any>()
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

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


  //delete farm
  const deleteFarm = async () => {
    try {
      setLoading(true)
      const response = await deleteFarmService(deleteId, accessToken);

      if (response.success) {
        setDeleteDialogOpen(false);
        setOpenFarmDetails(false)
        toast.success(response.message)
        getFarmOptions({
          search_string: router.query.search_string as string,
          location: router.query.location_id as string,
          userId: router.query.user_id as string,
          page: 1,
          limit: 20,
          sortBy: router.query.sort_by as string,
          sortType: router.query.sort_type as string,
        });

      } else if (response?.statusCode == 403) {
        await logout();
      } else {
        toast.error("Something went wrong")
      }
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)
    }
  };
  const router = useRouter();


  return (
    <>
      {data?.length ?
        data?.map((item: any, index: number) => {
          return (
            <div className={styles.farmcard} key={index}>
              <div className={styles.polygoncontainer}>
                <Image className={styles.polygonIcon} height={40} width={40} alt="" src="/marker.svg" />
              </div>
              <div className={styles.detailscontainer}>
                <div className={styles.nameandaction}>
                  <h2 className={styles.northSideChilli}>
                    {item.title.length > 16
                      ? item.title.slice(0, 1).toUpperCase() +
                      item.title.slice(1, 12) +
                      "..."
                      : item.title[0].toUpperCase() + item.title.slice(1)}
                  </h2>
                  {item?.geometry?.coordinates?.length ?


                    editFarmDetails?._id == item?._id ?
                      <IconButton
                        onClick={() => {
                          setSelectedPolygon(null)
                          setEditFarmsDetails(null)
                          setPolygonCoords([])
                          getFarmOptions({
                            search_string: router.query.search_string as string,

                            location: router.query.location_id as string,
                            userId: router.query.user_id as string,
                            page: 1,
                            limit: 20,
                            sortBy: router.query.sort_by as string,
                            sortType: router.query.sort_type as string,
                          });
                        }}>
                        <img alt="" src="/viewProcurement/procurement-delete-icon.svg" width={15} height={15} />
                      </IconButton> :
                      <IconButton onClick={() => {
                        setSelectedPolygon(null)
                        setEditFarmsDetails(null)
                        editPolygonDetails(item)
                      }}>
                        <img alt="" src="/editicon.svg" width={15} height={15} />
                      </IconButton>

                    : ""}
                  <IconButton
                    className={styles.moreoptionsbutton}
                    sx={{ borderRadius: "0px 0px 0px 0px", width: 24, height: 24 }}
                    onClick={() => {
                      setDeleteDialogOpen(true)
                      setDeleteID(item?._id)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>

                </div>
                <div className={styles.cropsacres}>
                  <div className={styles.cropscontainer}>

                    <h3 className={styles.cropName}>
                      {item?.geometry?.coordinates?.length ?
                        <IconButton
                          color="primary"
                          sx={{
                            borderRadius: "0px 0px 0px 0px",
                            display: item?.geometry?.coordinates?.length && !editFarmDetails?._id ? "" : "none",
                          }}
                          onClick={() => {
                            getFarmLocation(item.geometry.coordinates, item._id);
                          }}
                        >
                          <LocationOnIcon />
                        </IconButton> :

                        editFarmDetails?._id == item?._id ?
                          <IconButton
                            onClick={() => {
                              setSelectedPolygon(null)
                              setEditFarmsDetails(null)
                              setPolygonCoords([])
                              getFarmOptions({
                                search_string: router.query.search_string as string,
                                location: router.query.location_id as string,
                                userId: router.query.user_id as string,
                                page: 1,
                                limit: 20,
                                sortBy: router.query.sort_by as string,
                                sortType: router.query.sort_type as string,
                              });
                            }}>
                            <img alt="" src="/viewProcurement/procurement-delete-icon.svg" width={15} height={15} />
                          </IconButton> :
                          <IconButton
                            color="primary"
                            sx={{
                              borderRadius: "0px 0px 0px 0px",
                            }}


                            onClick={() => {
                              addPolyToExisting(item)
                            }}



                          >
                            +
                          </IconButton>}
                      {item?.location_id?.title}
                    </h3>
                  </div>
                  <p className={styles.acres}>{item.area}ac</p>
                </div>
                <div className={styles.locatedate}>


                  <p className={styles.createddate}>
                    {timePipe(item.createdAt, "DD-MM-YYYY")}
                  </p>
                  <div>
                    <Button className={styles.createddate} onClick={() => {
                      setOpenFarmDetails(true)
                      getFarmDataById(item?._id)
                      setSelectedPolygon(item?._id)
                    }}>
                      crops
                    </Button>
                    <Button className={styles.createddate} onClick={() => {
                      router.push(`/scouts?include=tags&page=1&limit=50&farm_id=${item?._id}`)

                    }}>
                      view
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
        :
        !farmOptionsLoading ?
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "calc(100vh - 180px)", width: "100%" }}>
            <NoDataMobileComponent noData={!Boolean(data.length)} noDataImg={"/NoDataImages/No_Farms.svg"} />
            <p className="noSummaryText">No Farms</p>
          </div>
          : ""}
      <AlertDelete
        deleteFarm={deleteFarm}
        setDialogOpen={setDeleteDialogOpen}
        open={deleteDialogOpen}
        loading={loading}
        deleteTitleProp={"Farm"}
      />
      <LoadingComponent loading={loading} />

    </>
  );
};

export default FarmListCard;
