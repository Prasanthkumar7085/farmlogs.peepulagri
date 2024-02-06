import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import updateMaterialStatusService from "../../../../lib/services/ProcurementServices/MaterialService/updateMaterialItemStatus";
import getMaterialsByProcurementIdService from "../../../../lib/services/ProcurementServices/getMaterialsByProcurementIdService";
import ViewMaterialDrawer from "./ViewMaterialDrawer";
import updateMaterialsByIdService from "../../../../lib/services/ProcurementServices/MaterialService/updateMaterialsByIdService";
import EditMaterialDrawer from "../MaterialCore/EditMaterialDrawer";
import getSingleMaterilsService from "../../../../lib/services/ProcurementServices/getSingleMaterilsService";
import { EditOutlined } from "@mui/icons-material";
import styles from "./viewProcurementTable.module.css"
import formatMoney from "@/pipes/formatMoney";
import ErrorMessages from "@/components/Core/ErrorMessages";
import addProcurementMaterialService from "../../../../lib/services/ProcurementServices/addProcurementMaterialService";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import deleteMaterialByIdService from "../../../../lib/services/ProcurementServices/deleteMaterialByIdService";
import AddMaterialDrawer from "../MaterialCore/AddMaterialDrawer";
import updateStatusService from "../../../../lib/services/ProcurementServices/updateStatusService";
import RejectReasonDilog from "@/components/Core/RejectReasonDilog";
import Image from "next/image";
import InfoIcon from '@mui/icons-material/Info';

interface ApiCallService {
  procurement_req_id: string;
  name: string;
  required_qty: number | null;
  required_units: string;
  available_qty?: number | null;
  available_units?: string;
}
const ViewProcurementTable = ({ data, afterMaterialStatusChange }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );

  const [materials, setMaterials] = useState<any>([]);
  const [materialDetails, setMaterialsDetails] = useState<any>();
  const [materialId, setMaterialId] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [editMaterialOpen, setEditMaterialOpen] = useState(false);
  const [addMaterialOpen, setAddMaterialOpen] = useState(false);
  const [editNameValue, setEditNameValue] = useState<string>("");

  const [editRequiredQty, setEditRequiredQty] = useState<
    null | number | string
  >(null);
  const [editRequiredUnits, setEditRequiredUnits] = useState<string>("");
  const [editAvailableQty, setEditAvailableQty] = useState<
    null | number | string
  >(null);
  const [editAvailableUnits, setEditAvailableUnits] = useState<string>("");

  const [updateLoading, setUpdateLoading] = useState(false);
  const [editMaterialId, setEditMaterialId] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [editErrorMessages, setEditErrorMessages] = useState({});
  const [addMaterial, setAddMaterial] = useState<any>(false)

  const [deleteMaterialOpen, setDeleteMaterialOpen] = useState(false);
  const [deleteMaterialId, setDeleteMaterialId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [rejectDilogOpen, setRejectDilogOpen] = useState<boolean>(false)
  const [selectedRow, setSelectedRow] = useState<any>()
  const [rejectLoading, setRejectLoading] = useState<any>(false)
  const [rejectedMaterials, setRejectedMaterial] = useState<any>()

  //logout function for 403 error
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

  //get all materials list
  const getAllProcurementMaterials = async () => {
    setLoading(true);
    try {
      let response = await getMaterialsByProcurementIdService({
        token: accessToken,
        procurementId: router.query.procurement_id as string,
      });
      if (response?.status == 200 || response?.status == 201) {
        const RejectFilterData = response?.data.filter((obj: any) => obj.status == "REJECTED")
        const remaining = response?.data.filter((obj: any) => obj.status !== "REJECTED");

        setMaterials(remaining);
        setRejectedMaterial(RejectFilterData)
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else if (response?.status == 403) {
        logout();
      } else {
        toast.error("Something went wrong");
        throw response;
      }
      if (response?.data) {

        const filteredData = response?.data.filter((obj: any) => obj.status !== "REJECTED" && obj.hasOwnProperty('price'));
        const allPurchaseOrNot = filteredData.every((obj: any) => obj.hasOwnProperty('price') && obj.price !== null);

        if (allPurchaseOrNot && filteredData?.length) {
          await procurementStatusChange("PURCHASED")
          await afterMaterialStatusChange(true)
        }
        else {
          afterMaterialStatusChange(true)
        }


        {
          response?.data.map((data: any) => {
            setMaterialsDetails(data.status);
          })
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //update the status
  const onStatusChangeEvent = async (changedStatus: any, material_id: any) => {
    setLoading(true);
    try {
      const response = await updateMaterialStatusService({
        material_id: material_id,
        status: changedStatus,
        accessToken,
      });

      if (response.success) {
        setDialogOpen(false);
        afterMaterialStatusChange(true)
        getAllProcurementMaterials();
        toast.success(response?.message);
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else if (response?.status == 403) {
        logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllProcurementMaterials();
    }

  }, [router.isReady, accessToken]);

  //update material by id event
  const updateMaterialById = async () => {
    setUpdateLoading(true);

    try {
      const body = {
        procurement_req_id: router.query.procurement_id,
        name: editNameValue,
        required_qty: editRequiredQty ? +editRequiredQty : null,
        required_units: editRequiredUnits,
        available_qty: editAvailableQty ? +editAvailableQty : null,
        available_units: editAvailableUnits,
      };
      const response = await updateMaterialsByIdService({
        token: accessToken,
        materialId: editMaterialId,
        body: body as ApiCallService,
      });
      if (response?.status == 200 || response?.status == 201) {
        setEditNameValue("");
        setEditRequiredQty(null);
        setEditRequiredUnits("");
        setEditAvailableQty(null);
        setEditAvailableUnits("");
        setEditMaterialOpen(false);
        toast.success(response?.message);

        getAllProcurementMaterials();
      } else if (response?.status == 422) {
        setEditErrorMessages(response?.errors);
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else if (response?.status == 403) {
        logout();
      } else {
        toast.error("Something went wrong");
        throw response;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };


  //get the single material
  const getSingleMaterials = async () => {
    setUpdateLoading(true);
    try {
      let response = await getSingleMaterilsService({
        token: accessToken,
        procurementId: editMaterialId,
      });
      if (response?.status == 200 || response?.status == 201) {
        setEditAvailableQty(response?.data?.available_qty);
        setEditAvailableUnits(response?.data?.available_units);
        setEditRequiredQty(response?.data?.required_qty);
        setEditRequiredUnits(response?.data?.required_units);
        setEditNameValue(response?.data?.name);
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else {
        toast.error("Something went wrong");
        throw response;
      }

    } catch (err) {
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  //api calls
  useEffect(() => {
    if (editMaterialOpen) {
      getSingleMaterials();
    } else {
      setEditNameValue("");
      setEditRequiredQty(null);
      setEditRequiredUnits("");
      setEditAvailableQty(null);
      setEditAvailableUnits("");
    }
  }, [editMaterialOpen])


  //calculate the sumof prices
  const sumOfPrices = (details: any) => {
    const sum = details.reduce((accumulator: any, currentValue: any) => accumulator + currentValue.price, 0);

    return sum;
  }

  //to captlize the upercase text
  const capitalizeFirstLetter = (string: any) => {
    let temp = string.toLowerCase();
    return temp.charAt(0).toUpperCase() + temp.slice(1);
  };

  //delete material  
  const deleteMaterial = async () => {
    setDeleteLoading(true);

    try {
      const response = await deleteMaterialByIdService({
        materialId: deleteMaterialId,
        token: accessToken,
      });
      if (response?.status == 200 || response?.status == 201) {
        setDeleteMaterialId("");
        setDeleteMaterialOpen(false);
        toast.success(response?.message);
        await getAllProcurementMaterials();
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else if (response?.status == 403) {
        logout();
      } else {
        toast.error("Something went wrong");
        throw response;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  //after add the matrials
  const afterAddingMaterials = (value: any) => {
    if (value) {

      setAddMaterialOpen(false)
      getAllProcurementMaterials()
    }
  }

  //after rejecting material
  const afterRejectingMaterial = async (value: any) => {
    if (value) {
      setLoading(true)
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/materials/${selectedRow}/${"reject"}`;

        const options = {
          method: "PATCH",
          body: JSON.stringify({
            reason: value
          }),
          headers: new Headers({
            'content-type': 'application/json',
            'authorization': accessToken
          }),
        }
        const response: any = await fetch(url, options);
        const responseData = await response.json();
        if (response.ok) {
          toast.success(responseData?.message)

          const rejectedData = materials.filter((item: any, index: number) => item?.status == "REJECTED");


          if (rejectedData.length == materials.length - 1) {
            procurementStatusChange("PENDING")
          }

          getAllProcurementMaterials()

        } else {
          return { message: 'Something Went Wrong', status: 500, details: responseData }
        }

      } catch (err: any) {
        console.error(err);
      }
      finally {
        setLoading(false)
      }
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

      }

    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoading(false)

    }
  }

  //overall status change
  const procurementStatusChange = async (status: string) => {
    try {
      const response = await updateStatusService({
        procurement_id: data?._id,
        status: status,
        accessToken,
      });
    }
    catch (err) {
      console.error(err)
    }
  }

  const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 200,
    },
  });

  return (
    <div className={styles.materialsBlock} style={{ width: "100%", }}>
      <div className={styles.materialHeader}>

        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <p className={styles.materialsBlockHeading}>Material Requirements</p>

          {data?.status == "PENDING" && (userDetails?._id == data?.requested_by?._id || userDetails?.user_type == "agronomist" || userDetails?.user_type == "central_team") ?
            <Button variant="outlined"
              sx={{ display: data?.tracking_details?.tracking_id ? "none" : "" }}
              className={styles.addMaterialBtn}
              onClick={() => {
                setAddMaterial(true)
                setAddMaterialOpen(true)
              }}>
              <Image src="/viewProcurement/view-procurement-add-icon.svg" alt="" width={10} height={10} />
              Add Material</Button> : ""}

        </div>
        {data?.status == "PENDING" && userDetails?.user_type == "central_team" ?
          <Button className={styles.aprroveMaterialBtn} variant="text"
            sx={{ display: data?.tracking_details?.tracking_id ? "none" : "" }}
            onClick={() => {
              approveAllMaterials()

            }}> <ImageComponent
              src={
                "/viewProcurement/procurement-approve-icon.svg"
              }
              height={14}
              width={14}
              alt=""
            /> Approve Materials</Button> : ""}
      </div>

      <div style={{ width: "95% !important", overflow: "auto !important", background: "#fff !important", margin: "0 auto" }} className="scrollbar">
        {materials?.length || rejectedMaterials?.length ? (
          <Table >
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableHeaderCell} sx={{ minWidth: "50px !important", whiteSpace: "nowrap !important" }}>Name</TableCell>
                <TableCell className={styles.tableHeaderCell} sx={{ minWidth: "80px !important", whiteSpace: "nowrap !important" }}>Available(Qty)</TableCell>
                <TableCell className={styles.tableHeaderCell} sx={{ minWidth: "80px !important", whiteSpace: "nowrap !important" }}>Procurement(Qty)</TableCell>
                <TableCell className={styles.tableHeaderCell} sx={{ minWidth: "100px !important", whiteSpace: "nowrap !important" }}>Status</TableCell>
                <TableCell className={styles.tableHeaderCell} sx={{ minWidth: "100px !important", whiteSpace: "nowrap !important" }}>Approved By</TableCell>
                {materialDetails ?
                  <>
                    <TableCell className={styles.tableHeaderCell} sx={{ minWidth: "100px !important", whiteSpace: "nowrap !important" }}>Vendor Details</TableCell>
                    <TableCell className={styles.tableHeaderCell} sx={{ minWidth: "50px !important", whiteSpace: "nowrap !important" }}>Price(Rs)</TableCell>
                  </>
                  : ''}
                {(userDetails?._id == data?.requested_by?._id || userDetails?.user_type == "agronomist" || userDetails?.user_type == "central_team") ?
                  <TableCell className={styles.tableHeaderCell} style={{ display: data?.status == "APPROVED" || data?.status == "SHIPPED" || data?.status == "DELIVERED" || (data?.status == "PURCHASED" || userDetails?.user_type == "central_team") || data?.status == "COMPLETED" || (userDetails?.user_type == "agronomist" && data?.status == "APPROVED") ? "none" : "", minWidth: "120px" }}>Actions</TableCell> : ""}
              </TableRow>
            </TableHead>
            <TableBody >
              {materials?.map((row: any, index: any) => {
                return (

                  <TableRow
                    className={styles.tableBodyRow}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    key={index}
                  >
                    <TableCell className={styles.tableBodyCell}>
                      <Tooltip title={row?.name ? row?.name : ""}>
                        {row?.name ? row?.name?.length > 20
                          ? row?.name?.slice(0, 1).toUpperCase() +
                          row?.name?.slice(1, 15) +
                          "..."
                          : row?.name?.slice(0, 1).toUpperCase() +
                          row?.name?.slice(1) : "----"}
                      </Tooltip>

                    </TableCell>
                    <TableCell className={styles.tableBodyCell}>
                      {row?.available_qty
                        ? row?.available_qty + " " + row.available_units
                        : "---"}
                    </TableCell>
                    <TableCell className={styles.tableBodyCell}>
                      {row?.required_qty
                        ? row?.required_qty.toFixed(2) + " " + row.required_units
                        : "---"}
                    </TableCell>
                    <TableCell className={styles.tableBodyCell}>
                      {row?.status ? capitalizeFirstLetter(row?.status) : "---"}
                      {row?.status == "REJECTED" ?
                        <Tooltip title={row?.reason}>
                          <InfoIcon />
                        </Tooltip>
                        : ""}</TableCell>
                    <TableCell className={styles.tableBodyCell}>
                      {row?.approved_by?.name ? row?.approved_by?.name : "---"}
                    </TableCell>
                    {
                      materialDetails ?
                        <>
                          <TableCell className={styles.tableBodyCell}>
                            {row?.vendor?.length ?
                              <CustomWidthTooltip title={row?.vendor} >
                                {row?.vendor?.length > 20
                                  ? row?.vendor.slice(0, 1).toUpperCase() +
                                  row?.vendor.slice(1, 20) +
                                  "..."
                                  : row?.vendor.slice(0, 1).toUpperCase() +
                                  row?.vendor.slice(1)}</CustomWidthTooltip> : "---"}
                          </TableCell>
                          <TableCell className={styles.tableBodyCell}>
                            {row?.price ? formatMoney(row?.price) : "---"}
                          </TableCell>
                        </>
                        : ''
                    }

                    <TableCell className={styles.tableBodyCell} style={{ display: data?.tracking_details?.tracking_id || !(userDetails?._id == data?.requested_by?._id || userDetails?.user_type == "agronomist" || userDetails?.user_type == "central_team") ? "none" : "" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {row?.status !== "PENDING" && row?.status !== "REJECTED" ? "" :
                          <>
                            <Tooltip title={"Edit"}>
                              <IconButton
                                onClick={() => {
                                  setEditMaterialId(row._id);
                                  setEditMaterialOpen(true);
                                }}
                              >
                                <ImageComponent
                                  src={
                                    "/viewProcurement/procurement-edit-icon.svg"
                                  }
                                  height={15}
                                  width={15}
                                  alt=""
                                />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={"Delete"}>

                              <IconButton
                                onClick={() => {
                                  setDeleteMaterialId(row._id)
                                  setDeleteMaterialOpen(true)
                                }
                                }
                              >
                                <ImageComponent
                                  src={
                                    "/viewProcurement/procurement-delete-icon.svg"
                                  }
                                  height={15}
                                  width={15}
                                  alt=""
                                />
                              </IconButton>
                            </Tooltip >


                          </>
                        }
                        {userDetails?.user_type == "central_team" || userDetails?.user_type == "manager" ?
                          <>
                            {row?.status !== "PENDING" ?
                              <Button
                                className={styles.addPurchaseBtn}
                                variant="contained"
                                sx={{
                                  display: row?.status == "REJECTED" ? "none" : "", background: row?.price && row?.vendor ? "#D94841" : "#56CCF2",
                                  "&:hover": {
                                    background: row?.price && row?.vendor ? "#D94841" : "#56CCF2",
                                  },

                                }}

                                onClick={() => {
                                  setMaterialId(row?._id);
                                  setMaterialOpen(true)
                                }
                                }
                              >
                                {row?.price && row?.vendor ? "Edit Purchase" : "Add Purchase"}

                              </Button>
                              :
                              ""}


                            <div style={{ cursor: "pointer", display: data?.status == "PURCHASED" ? "none" : "" }}>
                              <Tooltip title={row?.status == "REJECTED" ? "Approve" : "Reject"}>
                                <IconButton

                                  sx={{ display: row?.approved_by?.name ? "none" : "" }}
                                  onClick={() => {
                                    if (row?.status == "REJECTED") {

                                      onStatusChangeEvent("approve", row?._id)
                                    }
                                    else {
                                      setRejectDilogOpen(true)
                                      setSelectedRow(row?._id)
                                    }
                                  }
                                  }
                                >
                                  {row?.status == "REJECTED" ? <ImageComponent
                                    src={
                                      "/viewProcurement/procurement-approve-icon.svg"
                                    }
                                    height={19}
                                    width={19}
                                    alt=""
                                  /> : <ImageComponent
                                    src={
                                      "/viewProcurement/procurement-reject-icon.svg"
                                    }
                                    height={17}
                                    width={17}
                                    alt=""
                                  />}
                                </IconButton>
                              </Tooltip>
                            </div>
                          </>
                          : ""}


                      </div>
                    </TableCell>
                  </TableRow >

                );
              })}
              {
                materials?.some((obj: any) => obj.hasOwnProperty('price') && obj.price !== null && obj.price !== undefined && obj.price !== "")
                  ?
                  <TableRow className={styles.tableBodyRow}>
                    <TableCell colSpan={6} className={styles.tableBodyCell} sx={{ textAlign: "end" }}>
                      <Typography className={styles.totalAmountTitle} >Total Amount</Typography>

                    </TableCell>
                    <TableCell colSpan={7} className={styles.tableBodyCell}>
                      <Typography className={styles.totalAmount}>{formatMoney(sumOfPrices(materials))}</Typography>
                    </TableCell>
                  </TableRow> : ""
              }

              {
                rejectedMaterials?.map((row: any, index: any) => {
                  return (

                    <TableRow
                      className={styles.tableBodyRow}
                      // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={index}
                    >
                      <TableCell className={styles.tableBodyCell}>
                        {row?.name?.length ?
                          <CustomWidthTooltip title={row?.name} >
                            {row?.name?.length > 20
                              ? row?.name.slice(0, 1).toUpperCase() +
                              row?.name.slice(1, 20) +
                              "..."
                              : row?.name.slice(0, 1).toUpperCase() +
                              row?.name.slice(1)}</CustomWidthTooltip> : "---"}
                      </TableCell>


                      <TableCell className={styles.tableBodyCell}>
                        {row?.available_qty
                          ? row?.available_qty + " " + row.available_units
                          : "---"}
                      </TableCell>
                      <TableCell className={styles.tableBodyCell}>
                        {row?.required_qty
                          ? row?.required_qty + " " + row.required_units
                          : "---"}
                      </TableCell>
                      <TableCell className={styles.tableBodyCell}>
                        {row?.status ? capitalizeFirstLetter(row?.status) : "---"}
                        {row?.status == "REJECTED" ?
                          <Tooltip title={row?.reason}>
                            <InfoIcon />
                          </Tooltip>
                          : ""}</TableCell>
                      <TableCell className={styles.tableBodyCell}>
                        {row?.approved_by?.name ? row?.approved_by?.name : "---"}
                      </TableCell>
                      {materialDetails ?
                        <>
                          <TableCell className={styles.tableBodyCell}>
                            {row?.vendor?.length ?
                              <CustomWidthTooltip title={row?.vendor} >
                                {row?.vendor?.length > 20
                                  ? row?.vendor.slice(0, 1).toUpperCase() +
                                  row?.vendor.slice(1, 20) +
                                  "..."
                                  : row?.vendor.slice(0, 1).toUpperCase() +
                                  row?.vendor.slice(1)}</CustomWidthTooltip> : "---"}
                          </TableCell>
                          <TableCell className={styles.tableBodyCell}>
                            {row?.price ? formatMoney(row?.price) : "---"}
                          </TableCell>
                        </>
                        : ''}

                      <TableCell className={styles.tableBodyCell} style={{ display: data?.tracking_details?.tracking_id || data?.status == "PURCHASED" ? "none" : "" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          {row?.status !== "PENDING" && row?.status !== "REJECTED" ? "" :
                            <>
                              <Tooltip title={"Edit"}>
                                <IconButton
                                  onClick={() => {
                                    setEditMaterialId(row._id);
                                    setEditMaterialOpen(true);
                                  }}
                                >
                                  <ImageComponent
                                    src={
                                      "/viewProcurement/procurement-edit-icon.svg"
                                    }
                                    height={15}
                                    width={15}
                                    alt=""
                                  />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={"Delete"}>

                                <IconButton
                                  onClick={() => {
                                    setDeleteMaterialId(row._id)
                                    setDeleteMaterialOpen(true)
                                  }
                                  }
                                >
                                  <ImageComponent
                                    src={
                                      "/viewProcurement/procurement-delete-icon.svg"
                                    }
                                    height={15}
                                    width={15}
                                    alt=""
                                  />
                                </IconButton>
                              </Tooltip >


                            </>
                          }
                          {userDetails?.user_type == "central_team" || userDetails?.user_type == "manager" ?
                            <>
                              <div style={{ cursor: "pointer", display: data?.status == "PURCHASED" ? "none" : "" }}>
                                <Tooltip title={row?.status == "REJECTED" ? "Approve" : "Reject"}>
                                  <IconButton

                                    sx={{ display: row?.approved_by?.name ? "none" : "" }}
                                    onClick={() => {
                                      if (row?.status == "REJECTED") {

                                        onStatusChangeEvent("approve", row?._id)
                                      }
                                      else {
                                        setRejectDilogOpen(true)
                                        setSelectedRow(row?._id)
                                      }
                                    }
                                    }
                                  >
                                    {row?.status == "REJECTED" ? <ImageComponent
                                      src={
                                        "/viewProcurement/procurement-approve-icon.svg"
                                      }
                                      height={19}
                                      width={19}
                                      alt=""
                                    /> : <ImageComponent
                                      src={
                                        "/viewProcurement/procurement-reject-icon.svg"
                                      }
                                      height={17}
                                      width={17}
                                      alt=""
                                    />}
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </>
                            : ""}


                        </div>
                      </TableCell>
                    </TableRow>

                  );
                })
              }
            </TableBody >
          </Table >

        ) : (
          loading == false && <div style={{ display: "flex", justifyContent: "center" }}>
            <Image
              src={"/NoMaterialsImage.svg"}
              height={250}
              width={250}
              alt="no materials"
            />
          </div>
        )}
      </div >


      <hr>
      </hr>
      {data?.remarks ?
        <div className={styles.remarks}>
          <label className={styles.remarksLabel}>Remarks</label>
          <Typography className={styles.remarksText}>{data?.remarks}</Typography>
        </div> : ""}

      <LoadingComponent loading={loading} />
      <ViewMaterialDrawer materialId={materialId} materialOpen={materialOpen} setMaterialOpen={setMaterialOpen} getAllProcurementMaterials={getAllProcurementMaterials} />
      <EditMaterialDrawer
        editMaterialOpen={editMaterialOpen}
        setEditMaterialOpen={setEditMaterialOpen}
        editAvailableQty={editAvailableQty}
        setEditAvailableQty={setEditAvailableQty}
        editAvailableUnits={editAvailableUnits}
        setEditAvailableUnits={setEditAvailableUnits}
        editRequiredQty={editRequiredQty}
        setEditRequiredQty={setEditRequiredQty}
        editRequiredUnits={editRequiredUnits}
        setEditRequiredUnits={setEditRequiredUnits}
        editNameValue={editNameValue}
        setEditNameValue={setEditNameValue}
        editErrorMessages={editErrorMessages}
        setEditErrorMessages={setEditErrorMessages}
        updateMaterialById={updateMaterialById}
        updateLoading={updateLoading}
      />
      <AddMaterialDrawer
        addMaterialOpen={addMaterialOpen}
        afterAddingMaterials={afterAddingMaterials}
        setAddMaterialOpen={setAddMaterialOpen}
      />
      <Toaster richColors closeButton position="top-right" />
      <AlertDelete
        open={deleteMaterialOpen}
        deleteFarm={deleteMaterial}
        setDialogOpen={setDeleteMaterialOpen}
        loading={deleteLoading}
        deleteTitleProp={"Material"}
      />
      <RejectReasonDilog
        dialog={rejectDilogOpen}
        setRejectDilogOpen={setRejectDilogOpen}
        afterRejectingMaterial={afterRejectingMaterial}
        rejectLoading={rejectLoading}
      />
      {/* <AlertStautsChange open={dialogOpen} statusChange={onStatusChangeEvent} setDialogOpen={setDialogOpen} loading={loading} /> */}
    </div >
  );
};

export default ViewProcurementTable;
