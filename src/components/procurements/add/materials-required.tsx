import type { NextPage } from "next";
import { useState, useCallback, ChangeEvent, useEffect } from "react";
import {
  Button,
  Icon,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import UnitsDropdown from "./units-dropdown";
// import PortalPopup from "./portal-popup";
import Dropdown1 from "./dropdown1";
import styles from "./materials-required.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import addProcurementMaterialService from "../../../../lib/services/ProcurementServices/addProcurementMaterialService";
import ErrorMessages from "@/components/Core/ErrorMessages";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import LoadingComponent from "@/components/Core/LoadingComponent";
import getMaterialsByProcurementIdService from "../../../../lib/services/ProcurementServices/getMaterialsByProcurementIdService";
import { Delete, DeleteOutline, EditOutlined } from "@mui/icons-material";

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
  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllProcurementMaterials();
    }
  }, [router.isReady, accessToken]);
  return (
    <>
      <div className={styles.materialsrequired}>
        <div className={styles.group}>
          <div className={styles.heading}>
            <h2 className={styles.text}>Material Requirements</h2>
            <div className={styles.textAndSupportingText}>
              <p className={styles.supportingText}>
                You can add List of items here based on requirement
              </p>
              <Button
                color="primary"
                variant="contained"
                onClick={() => addMaterial()}
              >
                Add
              </Button>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.inputField}>
              <label className={styles.label}>
                Material Name <strong style={{ color: "red" }}>*</strong>
              </label>
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

            <div className={styles.personofcontact}>
              <label className={styles.label}>
                Material Procurement (Qty){" "}
                <strong style={{ color: "red" }}>*</strong>
              </label>
              <div className={styles.input1}>
                <div style={{ width: "80%" }}>
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
            <div className={styles.personofcontact}>
              <label className={styles.label}>
                Material Available (Qty)(optional)
              </label>
              <div className={styles.input1}>
                <TextField
                  className={styles.inputbox}
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
                              <EditOutlined sx={{ color: "red" }} />
                              <DeleteOutline sx={{ color: "red" }} />
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
        <div className={styles.row}>
          <div className={styles.personofcontact}>
            <label className={styles.label}>Person of Contact (POC)</label>
            <FormControl className={styles.selectbox} variant="outlined">
              <InputLabel color="primary" />
              <Select color="primary" defaultValue="Name">
                <MenuItem value="Gopi">Gopi</MenuItem>
                <MenuItem value="Latha">Latha</MenuItem>
                <MenuItem value="Madhuri">Madhuri</MenuItem>
                <MenuItem value="Sai">Sai</MenuItem>
              </Select>
              <FormHelperText />
            </FormControl>
          </div>
        </div>
      </div>

      <LoadingComponent loading={loading} />
    </>
  );
};

export default MaterialsRequired;
