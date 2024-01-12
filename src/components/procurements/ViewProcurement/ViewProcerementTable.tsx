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
  Typography,
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
  const [name, setName] = useState("");
  const [requiredQty, setRequiredQty] = useState<null | number | string>(null);
  const [requiredUnits, setRequiredUnits] = useState("");
  const [availableQty, setAvailableQty] = useState<null | number | string>(
    null
  );
  const [availableUnits, setAvailableUnits] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [editErrorMessages, setEditErrorMessages] = useState({});
  const [addMaterial, setAddMaterial] = useState<any>(false)

  const [deleteMaterialOpen, setDeleteMaterialOpen] = useState(false);
  const [deleteMaterialId, setDeleteMaterialId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

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
        setMaterials(response?.data);
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else if (response?.status == 403) {
        logout();
      } else {
        toast.error("Something went wrong");
        throw response;
      }
      if (response?.data) {
        afterMaterialStatusChange(true)
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

  return (
    <div className={styles.materialsBlock} style={{ width: "100%" }}>
      <p className={styles.materialsBlockHeading}>Required Materials</p>

      <div style={{ width: "100%", overflow: "auto", background: "#fff" }}>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button variant="outlined"
            sx={{ display: data?.tracking_details?.tracking_id ? "none" : "" }}
            onClick={() => {
              setAddMaterial(true)
              setAddMaterialOpen(true);
            }}>Add Materials</Button>
          {data?.status == "APPROVED" ? "" :
            <Button variant="contained"
              sx={{ display: data?.tracking_details?.tracking_id ? "none" : "" }}
              onClick={() => {
                approveAllMaterials()

              }}>Approve All</Button>}
        </div>

        {materials?.length ? (
          <div>
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell className={styles.tableHeaderCell}>Name</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Available(Qty)</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Procurement(Qty)</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Status</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Approved By</TableCell>
                  {materialDetails ?
                    <>
                      <TableCell className={styles.tableHeaderCell}>Name of Vendor</TableCell>
                      <TableCell className={styles.tableHeaderCell}>Price(Rs)</TableCell>
                    </>
                    : ''}
                  <TableCell className={styles.tableHeaderCell} style={{ display: data?.status == "SHIPPED" || data?.status == "DELIVERED" || data?.status == "COMPLETED" || (userDetails?.user_type == "agronomist" && data?.status == "PURCHASED") ? "none" : "" }}>Actions</TableCell>
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
                      <TableCell className={styles.tableBodyCell}>{row?.name ? row?.name : "---"}</TableCell>
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
                      <TableCell className={styles.tableBodyCell}>{row?.status ? capitalizeFirstLetter(row?.status) : "---"}</TableCell>
                      <TableCell className={styles.tableBodyCell}>
                        {row?.approved_by?.name ? row?.approved_by?.name : "---"}
                      </TableCell>
                      {materialDetails ?
                        <>
                          <TableCell className={styles.tableBodyCell}>{row?.vendor ? row?.vendor : "---"}</TableCell>
                          <TableCell className={styles.tableBodyCell}>
                            {row?.price ? formatMoney(row?.price) : "---"}
                          </TableCell>
                        </>
                        : ''}

                      <TableCell className={styles.tableBodyCell} style={{ display: data?.tracking_details?.tracking_id ? "none" : "" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {row?.status !== "PENDING" && row?.status !== "REJECTED" ? "" :
                            <>
                              <div style={{ cursor: "pointer" }}>
                                <IconButton
                                  onClick={() => {
                                    setDeleteMaterialId(row._id)
                                    setDeleteMaterialOpen(true)
                                  }
                                  }
                                >
                                  <ImageComponent
                                    src={
                                      "/viewTaskIcons/task-table-delete.svg"
                                    }
                                    height={17}
                                    width={17}
                                    alt=""
                                  />
                                </IconButton>
                              </div>
                              <div style={{ cursor: "pointer" }}>
                                <IconButton
                                  onClick={() => {
                                    setEditMaterialId(row._id);
                                    setEditMaterialOpen(true);
                                  }}
                                >
                                  <EditOutlined sx={{ color: "red" }} />
                                </IconButton>
                              </div>
                            </>
                          }


                          {userDetails?.user_type == "central_team" || userDetails?.user_type == "manager" ?
                            <>
                              {row?.status !== "PENDING" ?

                                <Button
                                  sx={{ display: row?.status == "REJECTED" ? "none" : "" }}
                                  variant="outlined"
                                  onClick={() => {
                                    setMaterialId(row?._id);
                                    setMaterialOpen(true)
                                  }
                                  }
                                >
                                  {row?.price && row?.vendor ? "Edit Purchase" : "Add Purchase"}

                                </Button>
                                :
                                <div style={{ cursor: "pointer" }}>
                                  <Button
                                    variant="outlined"
                                    onClick={() => {
                                      onStatusChangeEvent("approve", row?._id)
                                    }
                                    }
                                  >
                                    Approve
                                  </Button>
                                </div>}


                              <div style={{ cursor: "pointer" }}>
                                <Button
                                  variant="outlined"
                                  sx={{ display: row?.status == "PURCHASED" ? "none" : "" }}
                                  onClick={() => {
                                    if (row?.status == "REJECTED") {
                                      onStatusChangeEvent("approve", row?._id)

                                    }
                                    else {
                                      onStatusChangeEvent("reject", row?._id)
                                    }
                                  }
                                  }
                                >
                                  {row?.status == "REJECTED" ? "Approve" : "Reject"}
                                </Button>
                              </div>
                            </>
                            : ""}

                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

              </TableBody>
            </Table>
            {materials?.some((obj: any) => obj.hasOwnProperty('price') && obj.price !== null && obj.price !== undefined && obj.price !== "")
              ?
              <div className={styles.TotalAmountBlock}>
                <Typography className={styles.totalAmountTitle}>Total Amount</Typography>
                <Typography className={styles.totalAmount}>{formatMoney(sumOfPrices(materials))}</Typography>
              </div> : ""}
          </div>
        ) : (
          <div>No materials added</div>
        )}
      </div>

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
      {/* <AlertStautsChange open={dialogOpen} statusChange={onStatusChangeEvent} setDialogOpen={setDialogOpen} loading={loading} /> */}
    </div >
  );
};

export default ViewProcurementTable;
