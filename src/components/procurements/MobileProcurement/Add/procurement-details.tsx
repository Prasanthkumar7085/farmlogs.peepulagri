import type { NextPage } from "next";
import { Button, Icon, IconButton, Menu, MenuItem } from "@mui/material";
import ProcurementDetails from "./procurement-details";
import styles from "./procurement-details.module.css";
import ProcurementCard from "../ProcurementCard";
import ProcurementDetailsCard from "./ProcurementCard";
import formatMoney from "@/pipes/formatMoney";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useState } from "react";
import MobileAddMaterialDrawer from "@/components/Core/MobileAddMaterialDrawer";
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import updateStatusService from "../../../../../lib/services/ProcurementServices/updateStatusService";
import { useRouter } from "next/router";
const ProcurementDetailsMobile = ({ materials, procurementData, getAllProcurementMaterials, rejectedMaterials }: any) => {

  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openMaterialDrawer, setOpenMaterialDrawer] = useState<boolean>()
  const [editMaterialId, setEditMaterialId] = useState("");
  const [selectMaterial, setSelectMaterial] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  //calculate the sum of the prices
  const sumOfPrices = (details: any) => {
    const sum = details.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.price, 0);

    return sum;
  }


  //overall status change
  const procurementStatusChange = async (status: string) => {
    try {
      const response = await updateStatusService({
        procurement_id: router.query.procurement_id as string,
        status: status,
        accessToken,
      });
    }
    catch (err) {
      console.error(err)
    }
  }

  //approve all function
  const approveAllMaterials = async () => {
    setLoading(true)
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/${router.query.procurement_id}/approve-materials`;
      const options = {
        method: "PATCH",
        headers: new Headers({
          authorization: accessToken,
        }),
      };

      const response = await fetch(url, options)
      const responseData = await response.json()
      if (responseData?.success) {
        toast.success(responseData?.message);
        await procurementStatusChange("APPROVED")
        await getAllProcurementMaterials()
        handleClose()

      }

    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoading(false)

    }
  }



  return (
    <div className={styles.yourprocurementdetails} >
      {selectMaterial ?
        <div className={styles.headingcontainer}>
          <IconButton onClick={() => {
            setSelectMaterial(false)
          }}>
            <CloseIcon />
          </IconButton>
          <div className={styles.headingandcount}>


          </div>
          <IconButton onClick={(e) => {

          }}>
            <Image src={"/viewTaskIcons/task-table-delete.svg"} alt="delete" height={15} width={15} />
          </IconButton>
          {userDetails?.user_type == "central_team" || userDetails?.user_type == "manager" ?
            <IconButton
              sx={{ display: procurementData?.status == "APPROVED" ? "none" : "" }}
              onClick={(e) => {
                handleClick(e)

              }}>
              <Image src={"/viewProcurement/procurement-reject-icon.svg"} alt="delete" height={15} width={15} />
            </IconButton> : ""}
        </div>
        :
        <div className={styles.headingcontainer}>
          <img
            className={styles.procurementiconred}
            alt=""
            src="/procurement-red.svg"
          />
          <div className={styles.headingandcount}>
            <div className={styles.heading}>{`Your Procurement `}</div>
            <div className={styles.countcontainer}>
              <p className={styles.count}>{materials?.length}</p>
            </div>

          </div>
          {selectMaterial}
          <IconButton onClick={(e) => {
            handleClick(e)

          }}>
            <MoreVertIcon />
          </IconButton>
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
            <MenuItem
              onClick={() => setOpenMaterialDrawer(true)}
              sx={{ fontFamily: "'Inter', sans-serif", minHeight: "inherit" }}
            >+ Add Material
            </MenuItem>
            <MenuItem sx={{ fontFamily: "'Inter', sans-serif", minHeight: "inherit" }}
              onClick={() => {
                setSelectMaterial(true)

              }}>
              Select
            </MenuItem>
            {procurementData?.status == "PENDING" && userDetails?.user_type == "central_team" && materials?.length ?
              <MenuItem sx={{ fontFamily: "'Inter', sans-serif", minHeight: "inherit" }}
                onClick={() => approveAllMaterials()}
              >Approve Materials
              </MenuItem> : ""}
          </Menu>
        </div>}

      {materials?.length ?

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

                />

              )
            })
            }


          </ul>
          {materials?.some((obj: any) => obj.hasOwnProperty('price') && obj.price !== null && obj.price !== undefined && obj.price !== "") ?

            <div className={styles.totalamount}>
              <h3 className={styles.total}>Total</h3>
              <p className={styles.amount}>{formatMoney(sumOfPrices(materials))}</p>
            </div> : ""}


        </div> : ""}
      {rejectedMaterials?.length ?

        <div className={styles.datatable}>
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
                  materials={materials}

                />

              )
            })
            }


          </ul>



        </div> : ""}

      <MobileAddMaterialDrawer
        openMaterialDrawer={openMaterialDrawer}
        setOpenMaterialDrawer={setOpenMaterialDrawer}
        procurementData={procurementData}
        getAllProcurementMaterials={getAllProcurementMaterials}
        editMaterialId={editMaterialId}
        setEditMaterialId={setEditMaterialId}
      />
    </div>
  );
};

export default ProcurementDetailsMobile;
