import { Clear } from "@mui/icons-material";
import { Button, CircularProgress, Drawer, IconButton, MenuItem, Select, TextField } from "@mui/material";
import styles from "./addMaterial.module.css";
import ErrorMessages from "@/components/Core/ErrorMessages";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import addProcurementMaterialService from "../../../../lib/services/ProcurementServices/addProcurementMaterialService";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface ApiCallService {
    procurement_req_id: string;
    name: string;
    required_qty: number | null;
    required_units: string;
    available_qty?: number | null;
    available_units?: string;
}
const AddMaterialDrawer = ({
    addMaterialOpen,
    afterAddingMaterials,
    setAddMaterialOpen
}: any) => {

    const router = useRouter()
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [name, setName] = useState("");
    const [requiredQty, setRequiredQty] = useState<null | number | string>(null);
    const [requiredUnits, setRequiredUnits] = useState("");
    const [availableQty, setAvailableQty] = useState<null | number | string>(
        null
    );
    const [availableUnits, setAvailableUnits] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});

    //add material 
    const addMaterialEvent = async () => {
        setLoading(true);
        setErrorMessages({});
        try {
            const body = {
                procurement_req_id: router.query.procurement_id,
                name: name,
                required_qty: requiredQty ? +requiredQty : null,
                required_units: requiredUnits,
                available_qty: availableQty ? +availableQty : null,
                available_units: requiredUnits,
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
                afterAddingMaterials(true)
            } else if (response?.status == 422) {
                setErrorMessages(response?.errors);
            } else if (response?.status == 401) {
                toast.error(response?.message);
            }
            else {
                toast.error("Something went wrong");
                throw response;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    //for enteer only the numbeers
    const handleInput = (event: any) => {
        // Remove non-digit characters except for decimal point
        let value = event.target.value.replace(/[^\d.]/g, '');

        // Ensure only one decimal point exists
        const decimalCount = value.split('.').length - 1;
        if (decimalCount > 1) {
            // If more than one decimal point, remove extra ones
            const parts = value.split('.');
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // Ensure negative sign is not the first character
        if (value.startsWith('-')) {
            value = value.slice(1);
        }

        // Limit length to 50 characters
        event.target.value = value.slice(0, 50);
    };

    return (
        <Drawer anchor={"right"} open={addMaterialOpen}>
            <div className={styles.drawerBlock} >
                <div className={styles.drawerHeadingBlock}>
                    <h3 className={styles.drawerHeading}>Add Material</h3>
                    <IconButton sx={{ padding: "0" }}
                        onClick={() => {
                            setName("");
                            setRequiredQty("");
                            setRequiredUnits("");
                            setAvailableQty("");
                            setAvailableUnits("");
                            setAddMaterialOpen(false)
                        }}
                    >
                        <Clear />
                    </IconButton>
                </div>
                <div className={styles.eachInputField}>
                    <label className={styles.inputLabel}>
                        Material Name <b style={{ color: "red" }}>*</b>
                    </label>
                    <TextField
                        sx={{
                            background: "#fff",
                            width: "100%",
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: "8px 8px !important"
                            },
                            '& .MuiInputBase-input': {
                                fontSize: "clamp(12px, 0.72vw, 14px)",
                                fontFamily: "'Inter', sans-serif"
                            }
                        }}
                        size="small"
                        placeholder="Please enter the material title"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <ErrorMessages errorMessages={errorMessages} keyname={"name"} />
                </div>
                <div className={styles.eachInputField}>
                    <label className={styles.inputLabel}>
                        Material Procurement (Qty){" "}
                        <strong style={{ color: "red" }}>*</strong>
                    </label>
                    <TextField
                        size="small"
                        sx={{
                            width: "100%", background: "#fff",
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: "8px 8px !important"
                            },
                            '& .MuiInputBase-input': {
                                fontSize: "clamp(12px, 0.72vw, 14px)",
                                fontFamily: "'Inter', sans-serif"
                            }
                        }}
                        onInput={handleInput}
                        value={requiredQty}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setRequiredQty(e.target.value)
                        }
                        placeholder="Enter Procurement Quantity"
                        InputProps={{
                            endAdornment: (
                                <Select
                                    sx={{
                                        background: "#fff",
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderWidth: "0  !important",
                                            borderRadius: "0 8px 8px 0 !important"
                                        }
                                    }}
                                    value={requiredUnits}
                                    onChange={(e: any) => setRequiredUnits(e.target.value)}
                                >
                                    <MenuItem value="Litres">Litres</MenuItem>
                                    <MenuItem value="Kilograms">Kilograms</MenuItem>
                                </Select>

                            ),
                        }}

                    />

                    <ErrorMessages
                        errorMessages={errorMessages}
                        keyname={"required_qty"}
                    />
                    <ErrorMessages
                        errorMessages={errorMessages}
                        keyname={"required_units"}
                    />
                </div>
                <div className={styles.eachInputField}>
                    <label className={styles.inputLabel}>
                        Material Available (Qty)(optional)
                    </label>
                    <TextField
                        size="small"
                        sx={{
                            width: "100%", background: "#fff",
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: "8px 8px !important"
                            },
                            '& .MuiInputBase-input': {
                                fontSize: "clamp(12px, 0.72vw, 14px)",
                                fontFamily: "'Inter', sans-serif"
                            }
                        }} placeholder="Enter Availble Quantity"
                        variant="outlined"
                        onInput={handleInput}
                        value={availableQty}
                        onChange={(e: any) => setAvailableQty(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <Select
                                    sx={{
                                        background: "#fff",
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderWidth: "0 !important",
                                            borderRadius: "0 8px 8px 0 !important"
                                        }
                                    }} value={requiredUnits}
                                    onChange={(e: any) => setRequiredUnits(e.target.value)}
                                >
                                    <MenuItem value="Litres">Litres</MenuItem>
                                    <MenuItem value="Kilograms">Kilograms</MenuItem>
                                </Select>
                            ),
                        }}
                    />
                </div>
                <div className={styles.procurementFormBtn}>
                    <Button
                        className={styles.cancelBtn}
                        variant="outlined"
                        onClick={() => {
                            setName("");
                            setRequiredQty("");
                            setRequiredUnits("");
                            setAvailableQty("");
                            setAvailableUnits("");
                            setAddMaterialOpen(false)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={styles.submitBtn}

                        variant="contained"
                        onClick={() => addMaterialEvent()}
                    >
                        {loading ? (
                            <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                        ) : (
                            "Submit"
                        )}
                    </Button>
                </div>

            </div>
        </Drawer>
    )
}
export default AddMaterialDrawer;