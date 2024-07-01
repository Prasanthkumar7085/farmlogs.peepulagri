import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { storeEditPolygonCoords } from "@/Redux/Modules/Farms";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import LoadingComponent from "@/components/Core/LoadingComponent";
import NoDataMobileComponent from "@/components/Core/NoDataMobileComponent";
import timePipe from "@/pipes/timePipe";
import { Button, IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import deleteFarmService from "../../../../../../lib/services/FarmsService/deleteFarmService";
import styles from "./farmListCard.module.css";
const FarmListCard = ({
  data,
  getFarmLocation,
  editPolygonDetails,
  setEditFarmsDetails,
  editFarmDetails,
  getFarmOptions,
  setSelectedPolygon,
  setOpenFarmDetails,
  getFarmDataById,
  addPolyToExisting,
  farmOptionsLoading,
}: any) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteID] = useState<any>();
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

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
      setLoading(true);
      const response = await deleteFarmService(deleteId, accessToken);

      if (response.success) {
        setDeleteDialogOpen(false);
        setOpenFarmDetails(false);
        toast.success(response.message);
        getFarmOptions({
          search_string: router.query.search_string as string,
          location: router.query.location_id as string,
          userId: router.query.user_id as string,
          page: 1,
          limit: 20,
          sortBy: router.query.sort_by as string,
          sortType: router.query.sort_type as string,
          locationName: router.query.location_name,
        });
      } else if (response?.statusCode == 403) {
        await logout();
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();

  return (
    <>
      {data?.length ? (
        data?.map((item: any, index: number) => {
          return (
            <div className={styles.farmcard} key={index}>
              <div className={styles.polygoncontainer}>
                <Image
                  className={styles.polygonIcon}
                  height={40}
                  width={40}
                  alt=""
                  src="/marker.svg"
                />
              </div>
              <div className={styles.detailscontainer}>
                <div className={styles.nameandaction}>
                  <h2 className={styles.northSideChilli}>
                    {item?.title?.length > 16 ? (
                      <Tooltip title={item.title}>
                        <span>
                          {item.title.slice(0, 1).toUpperCase() +
                            item.title.slice(1, 12) +
                            "..."}
                        </span>
                      </Tooltip>
                    ) : (
                      item?.title
                      // item?.title?.toUpperCase() + item?.title?.slice(1)
                    )}
                  </h2>
                  {item?.geometry?.coordinates?.length ? (
                    editFarmDetails?._id == item?._id ? (
                      <Tooltip title={"Remove edit"} followCursor>
                        <IconButton
                          sx={{ padding: "0" }}
                          onClick={() => {
                            setSelectedPolygon(null);
                            setEditFarmsDetails(null);
                            dispatch(storeEditPolygonCoords([]));
                            getFarmOptions({
                              search_string: router.query
                                .search_string as string,
                              location: router.query.location_id as string,
                              userId: router.query.user_id as string,
                              page: router.query.page,
                              limit: 20,
                              sortBy: router.query.sort_by as string,
                              sortType: router.query.sort_type as string,
                              locationName: router.query.location_name,
                            });
                          }}
                        >
                          <Image
                            alt=""
                            src="/viewProcurement/procurement-delete-icon.svg"
                            width={15}
                            height={15}
                          />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title={"Edit farm"} followCursor>
                        <IconButton
                          sx={{
                            padding: "0",
                            display: editFarmDetails?._id ? "none" : "",
                          }}
                          onClick={() => {
                            setSelectedPolygon(null);
                            setEditFarmsDetails(item);
                            dispatch(storeEditPolygonCoords([]));
                            editPolygonDetails(item);
                          }}
                        >
                          <Image
                            alt=""
                            src="/markers/marker-edit-icon.svg"
                            width={15}
                            height={15}
                          />
                        </IconButton>
                      </Tooltip>
                    )
                  ) : (
                    ""
                  )}
                  <Tooltip title={"Delete farm"} followCursor>
                    <IconButton
                      className={styles.moreoptionsbutton}
                      sx={{
                        padding: "0",
                        display: editFarmDetails?._id ? "none" : "",
                      }}
                      onClick={() => {
                        setDeleteDialogOpen(true);
                        setDeleteID(item?._id);
                      }}
                    >
                      <Image
                        alt=""
                        src="/markers/marker-delete-icon.svg"
                        width={15}
                        height={15}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                <div className={styles.cropsacres}>
                  <div className={styles.cropscontainer}>
                    <h3
                      className={styles.cropName}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {item?.geometry?.coordinates?.length ? (
                        <Tooltip title={"Locate"} followCursor>
                          <IconButton
                            sx={{
                              padding: "0",
                              paddingRight: "8px",
                              borderRadius: "0px 0px 0px 0px",
                              display:
                                item?.geometry?.coordinates?.length &&
                                !editFarmDetails?._id
                                  ? ""
                                  : "none",
                            }}
                            onClick={() => {
                              getFarmLocation(
                                item.geometry.coordinates,
                                item._id
                              );
                            }}
                          >
                            <Image
                              src="/markers/marker-location-icon.svg"
                              alt=""
                              height={17}
                              width={17}
                            />
                          </IconButton>
                        </Tooltip>
                      ) : editFarmDetails?._id == item?._id ? (
                        <IconButton
                          sx={{ padding: "0", marginRight: "0.5rem" }}
                          onClick={() => {
                            setSelectedPolygon(null);
                            setEditFarmsDetails(null);
                            dispatch(storeEditPolygonCoords([]));
                            getFarmOptions({
                              search_string: router.query
                                .search_string as string,
                              location: router.query.location_id as string,
                              userId: router.query.user_id as string,
                              page: router.query.page,
                              limit: 20,
                              sortBy: router.query.sort_by as string,
                              sortType: router.query.sort_type as string,
                              locationName: router.query.location_name,
                            });
                          }}
                        >
                          <Image
                            alt=""
                            src="/viewProcurement/procurement-delete-icon.svg"
                            width={14}
                            height={14}
                          />
                        </IconButton>
                      ) : (
                        <Tooltip title={"Add polygon"} followCursor>
                          <IconButton
                            sx={{
                              padding: "0",
                              marginRight: "0.5rem",
                              color: "#45A845",
                            }}
                            onClick={() => {
                              addPolyToExisting(item);
                            }}
                          >
                            +
                          </IconButton>
                        </Tooltip>
                      )}

                      {item?.location_id?.title.length > 16 ? (
                        <Tooltip title={item?.location_id?.title}>
                          <span>
                            {item?.location_id?.title
                              .slice(0, 12)
                              .toUpperCase() + "..."}
                          </span>
                        </Tooltip>
                      ) : (
                        item?.location_id?.title.toUpperCase()
                      )}
                    </h3>
                  </div>
                  <p className={styles.acres}>{item.area?.toFixed(2)}ac</p>
                </div>
                <div className={styles.locatedate}>
                  <p className={styles.createddate}>
                    {timePipe(item.createdAt, "DD-MM-YYYY")}
                  </p>
                  <div className={styles.farmCardButtonGrp}>
                    <Button
                      className={styles.cropsBtn}
                      onClick={async () => {
                        router.push(`/farm/${item?._id}/crops`);
                      }}
                    >
                      crops
                    </Button>
                    <Button
                      className={styles.viewBtn}
                      onClick={() => {
                        router.push(
                          `/scouts?include=tags&page=1&limit=50&farm_search_string=${item?.title}&farm_id=${item?._id}`
                        );
                      }}
                    >
                      scouts
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : !farmOptionsLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "calc(100vh - 180px)",
            width: "100%",
          }}
        >
          <NoDataMobileComponent
            noData={!Boolean(data?.length)}
            noDataImg={"/NoDataImages/No_Farms.svg"}
          />
          <p className="noSummaryText">No Farms</p>
        </div>
      ) : (
        ""
      )}
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
