import type { NextPage } from "next";
import { Button, Icon, IconButton, Menu, MenuItem } from "@mui/material";
import ProcurementDetails from "./procurement-details";
import styles from "./procurement-details.module.css";
import DoneIcon from '@mui/icons-material/Done'; import ProcurementDetailsCard from "./ProcurementCard";
import formatMoney from "@/pipes/formatMoney";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useState } from "react";
import MobileAddMaterialDrawer from "@/components/Core/MobileAddMaterialDrawer";
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import updateStatusService from "../../../../../lib/services/ProcurementServices/updateStatusService";
import { useRouter } from "next/router";
import deleteMaterialsService from "../../../../../lib/services/ProcurementServices/MaterialService/deleteMaterialsService";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { removeItems } from "@/Redux/Modules/Otp";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import updateMaterialStatusService from "../../../../../lib/services/ProcurementServices/MaterialService/updateMaterialItemStatus";
const ProcurementDetailsMobile = ({
  materials,
  procurementData,
  getAllProcurementMaterials,
  rejectedMaterials,
  getProcurementById
}: any) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openMaterialDrawer, setOpenMaterialDrawer] = useState<boolean>();
  const [editMaterialId, setEditMaterialId] = useState("");
  const [selectMaterial, setSelectMaterial] = useState<any>();
  const [selectedItems, setSelectedItems] = useState<any>();

  const [loading, setLoading] = useState<boolean>(false);
  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const selectedItemsFromStore = useSelector(
    (state: any) => state.otp.selectedItems
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //calculate the sum of the prices
  const sumOfPrices = (details: any) => {
    const sum = details.reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue.price,
      0
    );

    return sum;
  };

  //overall status change
  const procurementStatusChange = async (status: string) => {
    try {
      const response = await updateStatusService({
        procurement_id: router.query.procurement_id as string,
        status: status,
        accessToken,
      });
    } catch (err) {
      console.error(err);
    }
  };

  //approve all function
  const approveAllMaterials = async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/${router.query.procurement_id}/approve-materials`;
      const options = {
        method: "PATCH",
        headers: new Headers({
          authorization: accessToken,
        }),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();
      if (responseData?.success) {
        toast.success(responseData?.message);
        await procurementStatusChange("APPROVED");
        await getAllProcurementMaterials();
        handleClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //delete array of materials
  const deleteMaterials = async (materials_ids: any) => {
    setLoading(true);
    try {
      const response = await deleteMaterialsService({
        accessToken,
        materials_ids,
      });
      if (response.success) {
        toast.success(response.message);
        setSelectMaterial(false);
        handleClose();
        dispatch(removeItems([]));
        await getAllProcurementMaterials();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //collect materails
  const collectMaterialsForDelete = (value: any) => {
    if (value) {
      setSelectedItems(value);
    }
  };

  const onStatusChangeEvent = async (changedStatus: any, material_id: any) => {
    setLoading(true);
    try {
      const response = await updateMaterialStatusService({
        material_id: material_id,
        status: changedStatus,
        accessToken,
      });

      if (response.success) {
        await getProcurementById()
        await getAllProcurementMaterials();
        toast.success(response?.message);
      } else if (response?.status == 401) {
        toast.error(response?.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.yourprocurementdetails}>
      {selectMaterial ? (
        <div className={styles.headingcontainer}>
          <IconButton
            sx={{ padding: "0" }}
            onClick={() => {
              setSelectMaterial(false);
              handleClose();
              dispatch(removeItems([]));
            }}
          >
            <CloseIcon />
          </IconButton>
          <div className={styles.headingandcount}></div>
          <IconButton
            sx={{ padding: "0" }}
            disabled={selectedItemsFromStore?.length ? false : true}
            onClick={(e) => {
              deleteMaterials(
                selectedItemsFromStore.map((item: any) => item._id)
              );
            }}
          >
            <Image
              src={
                selectedItemsFromStore?.length
                  ? "/viewTaskIcons/task-table-delete.svg"
                  : "/viewTaskIcons/task-table-delete-disable.svg"
              }
              alt="delete"
              height={17}
              width={17}
            />
          </IconButton>

          {/* {userDetails?.user_type == "central_team" ||
          userDetails?.user_type == "manager" ? (
            <IconButton
              sx={{
                display: procurementData?.status == "APPROVED" ? "none" : "",
              }}
              onClick={(e) => {
                handleClick(e);
              }}
            >
              <Image
                src={"/viewProcurement/procurement-reject-icon.svg"}
                alt="delete"
                height={15}
                width={15}
              />
            </IconButton>
          ) : (
            ""
          )} */}
        </div>
      ) : (
        <div className={styles.headingcontainer}>
          <Image
            className={styles.procurementiconred}
            alt=""
            src="/procurement-red.svg"
            height={20}
            width={20}
          />
          <div className={styles.headingandcount}>
            <div className={styles.heading}>{`Your Procurement `}</div>
            <div className={styles.countcontainer}>
              <p className={styles.count}>{materials?.length}</p>
            </div>
          </div>
          {userDetails?.user_type == "central_team" ||
            userDetails?.user_type == "agronomist" ||
            userDetails?._id == procurementData?.requested_by?._id ?

            <IconButton
              sx={{
                display: procurementData?.status == "PENDING" ? "" : "none!important",
              }}
              onClick={(e) => {
                handleClick(e);
              }}
            >
              <Image
                src="/mobileIcons/procurement/menu-icon-width-box.svg"
                alt=""
                width={20}
                height={20}
              />
            </IconButton> : ""}

          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            {userDetails?.user_type == "central_team" ||
              userDetails?.user_type == "agronomist" ||
              userDetails?._id == procurementData?.requested_by?._id ? (
              <MenuItem
                onClick={() => {
                  setOpenMaterialDrawer(true);
                  handleClose();
                }}
                className={styles.signleMenuItem}
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  minHeight: "inherit",
                  display:
                    router.query.procurement_id &&
                      (!router.pathname.includes("edit") && !router.pathname.includes("add"))
                      ? ""
                      : "none !important",
                }}
              >
                <AddIcon sx={{ fontSize: "1.2rem" }} /> Add Material
              </MenuItem>
            ) : (
              ""
            )}
            <MenuItem
              className={styles.signleMenuItem}
              onClick={() => {
                setSelectMaterial(true);
                handleClose();
              }}
            >
              <DoneIcon sx={{ fontSize: "1.2rem" }} />
              Select
            </MenuItem>
            {procurementData?.status == "PENDING" &&
              userDetails?.user_type == "central_team" &&
              materials?.length &&
              router.query.procurement_id ? (
              <MenuItem
                className={styles.signleMenuItem}
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  minHeight: "inherit",
                  display:
                    router.query.procurement_id &&
                      !router.pathname.includes("edit")
                      ? ""
                      : "none !important",
                }}
                onClick={() => {
                  approveAllMaterials();
                  handleClose();
                }}
              >
                <CheckCircleOutlineOutlinedIcon sx={{ fontSize: "1.2rem" }} />
                Approve Materials
              </MenuItem>
            ) : (
              ""
            )}
          </Menu>
        </div>
      )}

      {materials?.length ? (
        <div className={styles.datatable}>
          <ul className={styles.listofitems}>
            {materials.map((item: any, index: any) => {
              return (
                <ProcurementDetailsCard
                  key={index}
                  procurementData={procurementData}
                  item={item}
                  setEditMaterialId={setEditMaterialId}
                  setOpenMaterialDrawer={setOpenMaterialDrawer}
                  selectMaterial={selectMaterial}
                  openMaterialDrawer={openMaterialDrawer}
                  getAllProcurementMaterials={getAllProcurementMaterials}
                  procurementStatusChange={procurementStatusChange}
                  materials={materials}
                  collectMaterialsForDelete={collectMaterialsForDelete}
                  onStatusChangeEvent={onStatusChangeEvent}
                />
              );
            })}
          </ul>
          {materials?.some(
            (obj: any) =>
              obj.hasOwnProperty("price") &&
              obj.price !== null &&
              obj.price !== undefined &&
              obj.price !== ""
          ) ? (
            <div className={styles.totalamount}>
              <h3 className={styles.total}>Total</h3>
              <p className={styles.amount}>
                {formatMoney(sumOfPrices(materials))}
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      {rejectedMaterials?.length ? (
        <div
          className={styles.datatable}
          style={{ backgroundColor: "#ffc6c6" }}
        >
          <ul className={styles.listofitems}>
            {rejectedMaterials.map((item: any, index: any) => {
              return (
                <ProcurementDetailsCard
                  key={index}
                  procurementData={procurementData}
                  item={item}
                  setEditMaterialId={setEditMaterialId}
                  setOpenMaterialDrawer={setOpenMaterialDrawer}
                  selectMaterial={selectMaterial}
                  openMaterialDrawer={openMaterialDrawer}
                  getAllProcurementMaterials={getAllProcurementMaterials}
                  procurementStatusChange={procurementStatusChange}
                  materials={rejectedMaterials}
                  collectMaterialsForDelete={collectMaterialsForDelete}
                  onStatusChangeEvent={onStatusChangeEvent}
                />
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}

      <MobileAddMaterialDrawer
        openMaterialDrawer={openMaterialDrawer}
        setOpenMaterialDrawer={setOpenMaterialDrawer}
        procurementData={procurementData}
        getAllProcurementMaterials={getAllProcurementMaterials}
        editMaterialId={editMaterialId}
        setEditMaterialId={setEditMaterialId}
      />
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default ProcurementDetailsMobile;
