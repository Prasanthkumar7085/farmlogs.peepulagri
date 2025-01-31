import { Button, IconButton } from "@mui/material";
import styles from "./procurementCard.module.css"
import Image from "next/image";
import { useEffect, useState } from "react";
import formatMoney from "@/pipes/formatMoney";
import ImageComponent from "@/components/Core/ImageComponent";
import { useDispatch, useSelector } from "react-redux";
import MobileViewMaterialDrawer from "@/components/Core/MobileViewMaterialDrawer";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import RejectedReasonDrawer from "../../MaterialCore/RejectReasonDrawer";
import { toast } from "sonner";
import InfoIcon from "@mui/icons-material/Info";
import MobileAddMaterialDrawer from "@/components/Core/MobileAddMaterialDrawer";
import RejectedTextDrawer from "../../MaterialCore/RejectTextDrawer";
import { useRouter } from "next/router";
import { addItems, removeItems } from "@/Redux/Modules/Otp";
import VendorTextDrawer from "../../MaterialCore/VendorText";

const ProcurementCard = ({
  procurementData,
  item,
  selectMaterial,
  onStatusChangeEvent,
  getAllProcurementMaterials,
  procurementStatusChange,
  materials,
  collectMaterialsForDelete,
}: any) => {
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const router = useRouter();
  const dispatch = useDispatch();
  const [rejectedReasonTextOpen, setRejectReasonTextOpen] =
    useState<boolean>(false);
  const [reasonText, setReasonText] = useState<boolean>(false);
  const [openMaterialDrawer, setOpenMaterialDrawer] = useState<boolean>();
  const [editMaterialId, setEditMaterialId] = useState("");
  const [editMaterialOpen, setEditMaterialOpen] = useState<boolean>();
  const [tempItems, setTempItems] = useState();
  const [materialId, setMaterialId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [rejectDilogOpen, setRejectDilogOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );
  const [vendorDetails, setVendotDetails] = useState<any>()
  const [vendorTextOpen, setVendorTextOpen] = useState<boolean>()
  const selectedItems = useSelector((state: any) => state.otp.selectedItems);

  const handleChange = (itemId: any) => {
    const itemIndex = selectedItems?.findIndex(
      (item: any) => item._id === itemId._id
    );
    if (itemIndex === -1) {
      dispatch(addItems(itemId));
    } else {
      let temp = [...selectedItems];
      temp.splice(itemIndex, 1);
      dispatch(removeItems(temp));
    }
  };

  const afterRejectingMaterial = async (value: any) => {
    if (value) {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL
          }/procurement-requests/materials/${selectedRow}/${"reject"}`;

        const options = {
          method: "PATCH",
          body: JSON.stringify({
            reason: value,
          }),
          headers: new Headers({
            "content-type": "application/json",
            authorization: accessToken,
          }),
        };
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        if (response.ok) {
          toast.success(responseData?.message);

          const rejectedData = materials.filter(
            (item: any, index: number) => item?.status == "REJECTED"
          );

          if (rejectedData.length == materials.length - 1) {
            procurementStatusChange("PENDING");
          }

          getAllProcurementMaterials();
        } else {
          return {
            message: "Something Went Wrong",
            status: 500,
            details: responseData,
          };
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={styles.procurementdetails}>
      <div className={styles.materialdetails}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {selectMaterial ? (
            <input
              style={{
                width: "15px",
                height: "15px",
                border: "1px solid #000",
                marginBlock: "0",
                marginRight: "0.5rem",
              }}
              type="checkbox"
              checked={selectedItems?.some((ite: any) => ite._id === item._id)}
              onChange={() => {
                handleChange(item);
              }}
              title={item.id}
            />
          ) : (
            ""
          )}
          <h2 className={styles.materialname}>{item?.name}</h2>
        </div>
        <p className={styles.procurement}>
          Proc : {item.required_qty} {item.required_units == "Kilograms" ? "Kgs" : "lts"}
        </p>

      </div>
      <p
        className={styles.price}
        style={{
          display: item.status == "REJECTED" || !item.price ? "none" : "",
        }}
      >
        {formatMoney(item?.price)}
      </p>
      <IconButton onClick={() => {
        setVendorTextOpen(true)
        setVendotDetails(item?.vendor)
      }}
        sx={{
          display: item.status == "REJECTED" || !item.price ? "none" : "",
        }}>
        <Image alt="" src="/component-29.svg" height={18} width={18} />
      </IconButton>



      {item?.status !== "PENDING" && item?.status !== "REJECTED" ? (
        ""
      ) : (
        userDetails?.user_type == "central_team" ||
          userDetails?.user_type == "agronomist" ||
          userDetails?._id == procurementData?.requested_by?._id ?
          <IconButton
            sx={{
              display:
                procurementData?.status == "PURCHASED" ||
                  procurementData?.tracking_details?._id
                  ? "none !important"
                  : "",
            }}
            disabled={selectMaterial ? true : false}
            className={styles.iconButton}
            onClick={() => {
              setEditMaterialOpen(true);
              setEditMaterialId(item?._id);
            }}
          >
            <Image
              src="/pencil-simple-line 1.svg"
              alt="edit"
              width={13}
              height={13}
            />{" "}
          </IconButton> : ""
      )}

      {item?.status == "REJECTED" ? (
        <IconButton
          onClick={() => {
            setRejectReasonTextOpen(true);
            setEditMaterialId(item?._id);
            setReasonText(item);
          }}
        >
          <InfoIcon />
        </IconButton>
      ) : (
        ""
      )}

      {userDetails?.user_type == "central_team" ||
        userDetails?.user_type == "manager" ? (
        <div
          style={{
            display: procurementData?.tracking_details?._id ? "none" : "",
          }}
        >
          {item?.status !== "PENDING" && item?.status !== "REJECTED" ? (
            <IconButton
              className={item?.price && item?.vendor ? styles.iconButtonEdit : styles.iconButtonPay}
              sx={{
                display:
                  item?.status == "REJECTED" || router.pathname.includes("edit")
                    ? "none !important"
                    : "",
                background: item?.price && item?.vendor ? "#D94841" : "#45A845 !important",
                "&:hover": {
                  background:
                    item?.price && item?.vendor ? "#D94841" : "45A845",
                },
              }}
              onClick={() => {
                if (procurementData?.status == "APPROVED" || procurementData?.status == "PURCHASED") {
                  setOpenMaterialDrawer(true);
                  setEditMaterialId(item?._id);
                  setOpenMaterialDrawer(true);
                }
                else {
                  toast.info("Please delete or approve remaining materials")
                }

              }}
            >
              {item?.price && item?.vendor ? <Image
                src="/currency-inr-edit.svg"
                alt="edit"
                width={13}
                height={13}
              /> :
                <Image
                  src="/currency-inr.svg"
                  alt="edit"
                  width={13}
                  height={13}
                />}{" "}
            </IconButton>
          ) : (
            ""
          )}

          <div
            style={{
              cursor: "pointer",
              display:
                procurementData?.status == "PURCHASED" ||
                  procurementData?.tracking_details?._id ||
                  router.pathname.includes("edit") ||
                  item?.approved_by?.name ||
                  !router.query.procurement_id
                  ? "none"
                  : "",
            }}
          >
            <IconButton
              sx={{
                display:
                  item?.approved_by?.name || !router.query.procurement_id
                    ? "none important"
                    : "",
              }}
              disabled={selectMaterial ? true : false}
              onClick={() => {
                if (item?.status == "REJECTED") {

                  onStatusChangeEvent("approve", item?._id);


                }
                else {
                  setRejectDilogOpen(true);
                  setSelectedRow(item?._id);
                }
              }}
            >
              {item?.status == "REJECTED" ? (
                <ImageComponent
                  src={"/viewProcurement/procurement-approve-icon.svg"}
                  height={19}
                  width={19}
                  alt=""
                />
              ) : (
                <ImageComponent
                  src={"/viewProcurement/procurement-reject-icon.svg"}
                  height={17}
                  width={17}
                  alt=""
                />
              )}
            </IconButton>
          </div>
        </div>
      ) : (
        ""
      )
      }

      <MobileViewMaterialDrawer
        openMaterialDrawer={openMaterialDrawer}
        setOpenMaterialDrawer={setOpenMaterialDrawer}
        procurementData={procurementData}
        editMaterialId={editMaterialId}
        setEditMaterialId={setEditMaterialId}
        getAllProcurementMaterials={getAllProcurementMaterials}
      />

      <RejectedReasonDrawer
        dialog={rejectDilogOpen}
        setRejectDilogOpen={setRejectDilogOpen}
        afterRejectingMaterial={afterRejectingMaterial}
        rejectLoading={loading}
      />
      <RejectedTextDrawer
        rejectedReasonText={rejectedReasonTextOpen}
        setRejectReasonTextOpen={setRejectReasonTextOpen}
        reasonText={reasonText}
      />
      <VendorTextDrawer
        vendorTextOpen={vendorTextOpen}
        setVendorTextOpen={setVendorTextOpen}
        vendorText={vendorDetails}
      />

      <MobileAddMaterialDrawer
        openMaterialDrawer={editMaterialOpen}
        setOpenMaterialDrawer={setEditMaterialOpen}
        procurementData={procurementData}
        getAllProcurementMaterials={getAllProcurementMaterials}
        editMaterialId={editMaterialId}
        setEditMaterialId={setEditMaterialId}
      />
    </div >
  );
};
export default ProcurementCard;