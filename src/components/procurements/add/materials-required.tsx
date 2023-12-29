import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Drawer,
  FormControl,
  FormHelperText,
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
import type { NextPage } from "next";
import { ChangeEvent, useEffect, useState } from "react";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { Clear, DeleteOutline, Edit, EditOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import addProcurementMaterialService from "../../../../lib/services/ProcurementServices/addProcurementMaterialService";
import deleteMaterialByIdService from "../../../../lib/services/ProcurementServices/deleteMaterialByIdService";
import getMaterialsByProcurementIdService from "../../../../lib/services/ProcurementServices/getMaterialsByProcurementIdService";
import styles from "./materials-required.module.css";
import FooterActionButtons from "@/components/Tasks/AddTask/footer-action-buttons";
import updateMaterialsByIdService from "../../../../lib/services/ProcurementServices/MaterialService/updateMaterialsByIdService";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import EditMaterialDrawer from "../MaterialCore/EditMaterialDrawer";
import AddIcon from '@mui/icons-material/Add';
interface ApiCallService {
  procurement_req_id: string;
  name: string;
  required_qty: number | null;
  required_units: string;
  available_qty?: number | null;
  available_units?: string;
}
const MaterialsRequired: NextPage = () => {
  const dispatch = useDispatch();

  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const details = useSelector((state: any) => state.auth.userDetails);

  const router = useRouter();
  const [name, setName] = useState("");
  const [requiredQty, setRequiredQty] = useState<null | number | string>(null);
  const [requiredUnits, setRequiredUnits] = useState("");
  const [availableQty, setAvailableQty] = useState<null | number | string>(
    null
  );
  const [availableUnits, setAvailableUnits] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [materials, setMaterials] = useState([]);
  const [deleteMaterialOpen, setDeleteMaterialOpen] = useState(false);
  const [deleteMaterialId, setDeleteMaterialId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editMaterialOpen, setEditMaterialOpen] = useState(false);
  const [editMaterialData, setEditMaterialData] = useState({});
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

  const addMaterial = async () => {
    setLoading(true);
    setErrorMessages({});
    try {
      const body = {
        procurement_req_id: router.query.procurement_id,
        name: name,
        required_qty: requiredQty ? +requiredQty : null,
        required_units: requiredUnits,
        available_qty: availableQty ? +availableQty : null,
        available_units: availableUnits,
      };
      const response = await addProcurementMaterialService({
        token: accessToken,
        body: body as ApiCallService,
      });

      if (response?.status == 200 || response?.status == 201) {
        setName("");
        setRequiredQty("");
        setRequiredUnits("");
        setAvailableQty("");
        setAvailableUnits("");

        toast.success(response?.message);
        getAllProcurementMaterials();
      } else if (response?.status == 422) {
        setErrorMessages(response?.errors);
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
      setLoading(false);
    }
  };

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const addPOCtoProcurement = async () => {
    try {
      setLoading(true);
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


  return (
    <div style={{ width: "50%", margin: "0 auto 0", paddingBottom: "3rem", background: "#fff" }}>
      <div className={styles.materialsrequired}>
        <div className={styles.heading}>
          <div >
            <h2 className={styles.text}>Material Requirements</h2>
            <p className={styles.supportingText}>
              You can add List of items here based on requirement
            </p>

          </div>
          <Button
            color="primary"
            variant="contained"
            onClick={() => addMaterial()}
            className={styles.addMaterialBtn}
          >
            <AddIcon sx={{ fontSize: "1.2rem" }} />  Add
          </Button>
        </div>

        <div className={styles.materialsGrid}>
          <div className={styles.eachMaterialBlock} >
            <h6 className={styles.label}>
              Material Name <strong style={{ color: "red" }}>*</strong>
            </h6>
            <div style={{ width: "100%" }}>
              <TextField
                size="small"
                placeholder="Please enter the material title"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{
                  background: "#fff",
                  borderRadius: "4px",
                  width: "100%"
                }}
              />
              {/* <ErrorMessages errorMessages={errorMessages} keyname={"name"} /> */}
            </div>
          </div>

          <div className={styles.eachMaterialBlock} >
            <h6 className={styles.label}>
              Material Procurement (Qty) <strong style={{ color: "red" }}>*</strong>

            </h6>
            <div style={{ display: "flex" }}>
              <div >
                <TextField

                  size="small"
                  sx={{
                    width: "100%", background: "#fff",
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: "1px 0 1px 1px !important",
                      borderRadius: "4px 0 0 4px !important"
                    }
                  }}
                  placeholder="Enter Procurement Quantity"
                  variant="outlined"
                  type="number"
                  value={requiredQty}
                  onChange={(e: any) => setRequiredQty(e.target.value)}
                />
                {/* <ErrorMessages
                  errorMessages={errorMessages}
                  keyname={"required_qty"}
                /> */}

              </div>
              <FormControl variant="outlined">
                <InputLabel color="primary" />
                <Select
                  sx={{
                    background: "#fff",
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: "1px 1px 1px 0 !important",
                      borderRadius: "0 4px 4px 0 !important"
                    }
                  }}
                  size="small"
                  defaultValue="Litres"
                  value={requiredUnits}
                  onChange={(e: any) => setRequiredUnits(e.target.value)}
                >
                  <MenuItem value="Litres">Litres</MenuItem>
                  <MenuItem value="Kilograms">Kilograms</MenuItem>
                </Select>
                {/* <FormHelperText /> */}
                {/* <ErrorMessages
                  errorMessages={errorMessages}
                  keyname={"required_units"}
                /> */}
              </FormControl>
            </div>
          </div>
          <div className={styles.eachMaterialBlock} >
            <h6 className={styles.label}>
              Material Available (Qty)(optional)
            </h6>
            <div style={{ display: "flex" }}>
              <TextField
                size="small"
                placeholder="Enter Availble Quantity"
                variant="outlined"
                type="number"
                value={availableQty}
                onChange={(e: any) => setAvailableQty(e.target.value)}
                sx={{
                  width: "100%", background: "#fff",
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: "1px 0 1px 1px !important",
                    borderRadius: "4px 0 0 4px !important"
                  }
                }}
              />
              <FormControl variant="outlined">
                <InputLabel color="primary" />
                <Select
                  sx={{
                    background: "#fff",
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: "1px 1px 1px 0 !important",
                      borderRadius: "0 4px 4px 0 !important"
                    }
                  }}
                  size="small"
                  defaultValue="Litres"
                  value={availableUnits}
                  onChange={(e: any) => setAvailableUnits(e.target.value)}
                >
                  <MenuItem value="Litres">Litres</MenuItem>
                  <MenuItem value="Kilograms">Kilograms</MenuItem>
                </Select>
                {/* <FormHelperText sx={{ margin: "0" }} /> */}
              </FormControl>
            </div>
          </div>
        </div>

        <div className={styles.materialListBlock}>
          <h4 className={styles.text}>Selected Materials:</h4>
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S. No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Material Procurement (Qty)</TableCell>
                  <TableCell>Material Availability (Qty)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materials.length
                  ? materials.map(
                    (
                      item: {
                        _id: string;
                        name: string;
                        required_qty: number;
                        required_units: string;
                        available_qty: number | null;
                        available_units: string;
                      },
                      index: number
                    ) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}.</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            {item.required_qty ? `${item.required_qty}` : ""}
                            {item.required_units
                              ? `(${item.required_units})`
                              : ""}
                          </TableCell>
                          <TableCell>
                            {item.available_qty
                              ? `${item.available_qty}`
                              : ""}
                            {item.available_units
                              ? `(${item.available_units})`
                              : ""}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                setEditAvailableQty(item.available_qty);
                                setEditAvailableUnits(item.available_units);
                                setEditRequiredQty(item.required_qty);
                                setEditRequiredUnits(item.required_units);
                                setEditNameValue(item.name);

                                setEditMaterialId(item._id);
                                setEditMaterialOpen(true);
                              }}
                            >
                              <EditOutlined sx={{ color: "red" }} />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setDeleteMaterialId(item._id);
                                setDeleteMaterialOpen(true);
                              }}
                            >
                              <DeleteOutline sx={{ color: "red" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )
                  : "No Materials"}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AlertDelete
        open={deleteMaterialOpen}
        deleteFarm={deleteMaterial}
        setDialogOpen={setDeleteMaterialOpen}
        loading={deleteLoading}
        deleteTitleProp={"Material"}
      />

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
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default MaterialsRequired;
