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

  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

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
      removeCookie("userType");
      loggedIn("loggedIn");
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
    <Card style={{ width: "60%", height: "80vh", marginLeft: "23%", marginTop: "40px" }}>
      <div className={styles.materialsrequired}>
        <div className={styles.heading}>
          <h2 className={styles.text}>Material Requirements</h2>
          <div className={styles.textAndSupportingText}>
            <p className={styles.supportingText}>
              You can add List of items here based on requirement
            </p>

          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          <div style={{ width: "100%" }}>
            <h6 className={styles.label}>
              Material Name <strong style={{ color: "red" }}>*</strong>
            </h6>
            <TextField
              className={styles.input}
              color="primary"
              placeholder="Please enter the material title"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <ErrorMessages errorMessages={errorMessages} keyname={"name"} />
          </div>

          <div style={{ width: "100%" }}>
            <h6>
              Material Procurement (Qty) <strong style={{ color: "red" }}>*</strong>

            </h6>
            <div style={{ display: "flex" }}>
              <div >
                <TextField
                  className={styles.inputbox}
                  sx={{ width: "100%" }}
                  color="primary"
                  placeholder="Enter Procurement Quantity"
                  variant="outlined"
                  type="number"
                  value={requiredQty}
                  onChange={(e: any) => setRequiredQty(e.target.value)}
                />
                <ErrorMessages
                  errorMessages={errorMessages}
                  keyname={"required_qty"}
                />
              </div>
              <FormControl className={styles.dropdown} variant="outlined">
                <InputLabel color="primary" />
                <Select
                  color="primary"
                  defaultValue="Litres"
                  value={requiredUnits}
                  onChange={(e: any) => setRequiredUnits(e.target.value)}
                >
                  <MenuItem value="Litres">Litres</MenuItem>
                  <MenuItem value="Kilograms">Kilograms</MenuItem>
                </Select>
                <FormHelperText />
                <ErrorMessages
                  errorMessages={errorMessages}
                  keyname={"required_units"}
                />
              </FormControl>
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <h6 >
              Material Available (Qty)(optional)
            </h6>
            <div style={{ display: "flex" }}>
              <TextField
                color="primary"
                placeholder="Enter Availble Quantity"
                variant="outlined"
                type="number"
                value={availableQty}
                onChange={(e: any) => setAvailableQty(e.target.value)}
              />
              <FormControl className={styles.dropdown} variant="outlined">
                <InputLabel color="primary" />
                <Select
                  color="primary"
                  defaultValue="Litres"
                  value={availableUnits}
                  onChange={(e: any) => setAvailableUnits(e.target.value)}
                >
                  <MenuItem value="Litres">Litres</MenuItem>
                  <MenuItem value="Kilograms">Kilograms</MenuItem>
                </Select>
                <FormHelperText />
              </FormControl>
            </div>
          </div>
          <div >
            <Button
              color="primary"
              variant="contained"
              onClick={() => addMaterial()}
            >
              Add
            </Button>
          </div>
        </div>

        <div>
          <div>
            <h4>Selected Materials:</h4>
          </div>
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
    </Card>
  );
};

export default MaterialsRequired;
