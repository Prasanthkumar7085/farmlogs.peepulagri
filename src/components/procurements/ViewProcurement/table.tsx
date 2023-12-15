import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import updateMaterialStatusService from "../../../../lib/services/ProcurementServices/MaterialService/updateMaterialItemStatus";
import getMaterialsByProcurementIdService from "../../../../lib/services/ProcurementServices/getMaterialsByProcurementIdService";
import ViewMaterialDrawer from "./ViewMaterialDrawer";
import updateMaterialsByIdService from "../../../../lib/services/ProcurementServices/MaterialService/updateMaterialsByIdService";
import EditMaterialDrawer from "../MaterialCore/EditMaterialDrawer";
import getSingleMaterilsService from "../../../../lib/services/ProcurementServices/getSingleMaterilsService";
import { EditOutlined } from "@mui/icons-material"

interface ApiCallService {
  procurement_req_id: string;
  name: string;
  required_qty: number | null;
  required_units: string;
  available_qty?: number | null;
  available_units?: string;
}
const ViewProcurementTable = ({ data }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [materials, setMaterials] = useState<any>([]);
  const [materialDetails, setMaterialsDetails] = useState<any>();
  const [materialId, setMaterialId] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [editMaterialOpen, setEditMaterialOpen] = useState(false);
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

  const [editErrorMessages, setEditErrorMessages] = useState({});

  //logout function for 403 error
  const logout = async () => {
    try {
      removeCookie("userType");
      loggedIn("loggedIn");
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
  return (
    <div>
      <hr />
      {materials?.length ? (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Available(Qty)</TableCell>
              <TableCell>Procurement(Qty)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Approved By</TableCell>
              {materialDetails ?
                <>
                  <TableCell>Name of Vendor</TableCell>
                  <TableCell>Price(Rs)</TableCell>
                </>
                : ''}
              <TableCell style={{ display: data.status == "SHIPPED" || data.status == "DELIVERED" ? "none" : "" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials?.map((row: any, index: any) => {
              return (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  key={index}
                >
                  <TableCell>{row?.name ? row?.name : "---"}</TableCell>
                  <TableCell>
                    {row?.available_qty
                      ? row?.available_qty + " " + row.available_units
                      : "---"}
                  </TableCell>
                  <TableCell>
                    {row?.required_qty
                      ? row?.required_qty + " " + row.required_units
                      : "---"}
                  </TableCell>
                  <TableCell>{row?.status ? row?.status : "---"}</TableCell>
                  <TableCell>
                    {row?.approved_by ? row?.approved_by : "---"}
                  </TableCell>
                  {materialDetails ?
                    <>
                      <TableCell>{row?.vendor ? row?.vendor : "---"}</TableCell>
                      <TableCell>
                        {row?.price ? row?.price : "---"}
                      </TableCell>
                    </>
                    : ''}
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {row?.status !== "APPROVED" ? (
                        <div style={{ cursor: "pointer" }}>
                          {!row?.price && row?.status !== "REJECTED" ?
                            <IconButton
                              onClick={() =>
                                onStatusChangeEvent("reject", row?._id)
                              }
                            >
                              <RemoveCircleOutlineIcon />
                            </IconButton>
                            : ''}
                        </div>
                      ) : (
                        ""
                      )}
                      {row?.status !== "APPROVED" ? (
                        <div style={{ cursor: "pointer" }}>
                          {!row?.price && !row?.vendor ?
                            <IconButton
                              onClick={() => {
                                setEditMaterialId(row._id);
                                setEditMaterialOpen(true);
                              }}
                            >
                              <EditOutlined sx={{ color: "red" }} />
                            </IconButton>
                            : ''}

                        </div>
                      ) : (
                        ""
                      )}

                      <div style={{ cursor: "pointer", display: data.status == "SHIPPED" || data.status == "DELIVERED" ? "none" : "block" }}>
                        {row?.status == "APPROVED" ? (
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setMaterialId(row?._id);
                              setMaterialOpen(true)
                            }
                            }
                          >
                            {row?.price && row?.vendor ? "Edit Purchase" : "Add Purchase"}

                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            onClick={() => {
                              if (!row?.price && !row?.vendor) {
                                onStatusChangeEvent("approve", row?._id)
                              } else {
                                setMaterialId(row?._id);
                                setMaterialOpen(true)
                              }
                            }
                            }
                          >

                            {row?.price && row?.vendor ? "Edit Purchase" : "Approve"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow >
              <TableCell colSpan={1}></TableCell>
              <TableCell colSpan={1}></TableCell>
              <TableCell colSpan={1}></TableCell>
              <TableCell colSpan={1}></TableCell>
              <TableCell colSpan={1}></TableCell>
              <TableCell colSpan={1}>Total</TableCell>
              <TableCell colSpan={1}>{sumOfPrices(materials)}</TableCell>

            </TableRow>

          </TableBody>
        </Table>
      ) : (
        ""
      )}

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
      {/* <AlertStautsChange open={dialogOpen} statusChange={onStatusChangeEvent} setDialogOpen={setDialogOpen} loading={loading} /> */}
    </div>
  );
};

export default ViewProcurementTable;
