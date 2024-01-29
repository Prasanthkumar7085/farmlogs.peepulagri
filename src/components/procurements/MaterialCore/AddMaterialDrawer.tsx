import { Clear } from "@mui/icons-material";
import { Button, CircularProgress, Drawer, IconButton, MenuItem, Select, TextField } from "@mui/material";
import styles from "../add/materials-required.module.css";
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
        const value = event.target.value.replace(/\D/g, '');
        event.target.value = value.slice(0, 20);
    };
    return (
        <Drawer anchor={"right"} open={addMaterialOpen}>
            <div style={{ width: "300px", padding: ".5rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3>Add Material</h3>
                    <IconButton
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
                <div className={styles.inputField}>
                    <label className={styles.label}>
                        Material Name <b style={{ color: "red" }}>*</b>
                    </label>
                    <TextField
                        sx={{
                            background: "#fff",
                            borderRadius: "4px",
                            width: "100%"
                        }}
                        size="small"
                        placeholder="Please enter the material title"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <ErrorMessages errorMessages={errorMessages} keyname={"name"} />
                </div>
                <div>
                    <label className={styles.label}>
                        Material Procurement (Qty){" "}
                        <strong style={{ color: "red" }}>*</strong>
                    </label>
                    <TextField
                        size="small"
                        sx={{
                            width: "100%", background: "#fff",
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderWidth: "1px 0 1px 1px !important",
                                borderRadius: "4px 0 0 4px !important"
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
                                            borderWidth: "1px 1px 1px 0 !important",
                                            borderRadius: "0 4px 4px 0 !important"
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
                </div>

                <div className={styles.personofcontact}>
                    <label className={styles.label}>
                        Material Available (Qty)(optional)
                    </label>
                    <div className={styles.input1}>
                        <TextField
                            size="small"
                            sx={{
                                width: "100%", background: "#fff",
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: "1px 0 1px 1px !important",
                                    borderRadius: "4px 0 0 4px !important"
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
                                                borderWidth: "1px 1px 1px 0 !important",
                                                borderRadius: "0 4px 4px 0 !important"
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
                        <ErrorMessages
                            errorMessages={errorMessages}
                            keyname={"required_units"}
                        />
                    </div>
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