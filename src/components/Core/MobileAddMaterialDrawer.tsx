import { Button, CircularProgress, Drawer, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "/src/components/procurements/MobileProcurement/Add/add-materials.module.css";
import ErrorMessages from "./ErrorMessages";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import addProcurementMaterialService from "../../../lib/services/ProcurementServices/addProcurementMaterialService";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import getSingleMaterilsService from "../../../lib/services/ProcurementServices/getSingleMaterilsService";
import updateMaterialsByIdService from "../../../lib/services/ProcurementServices/MaterialService/updateMaterialsByIdService";
import LoadingComponent from "./LoadingComponent";
import Image from "next/image";


interface ApiCallService {
    procurement_req_id: string;
    name: string;
    required_qty: number | null;
    required_units: string;
    available_qty?: number | null;
    available_units?: string;
}


const MobileAddMaterialDrawer = ({
    openMaterialDrawer,
    setOpenMaterialDrawer, procurementData,
    getAllProcurementMaterials,
    editMaterialId,
    setEditMaterialId }: any) => {

    const router = useRouter();
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
    const [editErrorMessages, setEditErrorMessages] = useState({});

    const addMaterial = async () => {
        setLoading(true);
        setErrorMessages({});
        try {
            const body = {
                procurement_req_id: router.query.procurement_id || procurementData?._id,
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
                setOpenMaterialDrawer(false)
                toast.success(response?.message);
                await getAllProcurementMaterials()
            } else if (response?.status == 422) {
                setErrorMessages(response?.errors);
            } else if (response?.status == 401) {
                toast.error(response?.message);
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
        setLoading(true);

        try {
            const body = {
                procurement_req_id: router.query.procurement_id || procurementData?._id,
                name: name,
                required_qty: requiredQty ? +requiredQty : null,
                required_units: requiredUnits,
                available_qty: availableQty ? +availableQty : null,
                available_units: requiredUnits,
            };
            const response = await updateMaterialsByIdService({
                token: accessToken,
                materialId: editMaterialId,
                body: body as ApiCallService,
            });
            if (response?.status == 200 || response?.status == 201) {
                setName("");
                setRequiredQty("");
                setRequiredUnits("");
                setAvailableQty("");
                setAvailableUnits("");
                setEditMaterialId("")
                setOpenMaterialDrawer(false)
                toast.success(response?.message);
                getAllProcurementMaterials();
            } else if (response?.status == 422) {
                setErrorMessages(response?.errors);
            } else if (response?.status == 401) {
                toast.error(response?.message);
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


    //get the single material
    const getSingleMaterials = async () => {
        setLoading(true);
        try {
            let response = await getSingleMaterilsService({
                token: accessToken,
                procurementId: editMaterialId,
            });
            if (response?.status == 200 || response?.status == 201) {
                setAvailableQty(response?.data?.available_qty);
                setAvailableUnits(response?.data?.available_units);
                setRequiredQty(response?.data?.required_qty);
                setRequiredUnits(response?.data?.required_units);
                setName(response?.data?.name);
            } else if (response?.status == 401) {
                toast.error(response?.message);
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

    //api calls
    useEffect(() => {
        if (editMaterialId && accessToken) {
            getSingleMaterials();
        } else {
            setAvailableQty("");
            setAvailableUnits("");
            setRequiredQty("");
            setRequiredUnits("");
            setName("");
        }
    }, [editMaterialId, openMaterialDrawer, accessToken])

    const handleInput = (event: any) => {
        const value = event.target.value.replace(/\D/g, '');
        event.target.value = value.slice(0, 20);
    };


    return (
        <Drawer
            anchor={"bottom"}
            open={openMaterialDrawer}
            sx={{
                zIndex: "1300 !important",
                "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "500px",
                    margin: "0 auto",
                    borderRadius: "20px 20px 0 0 ",
                },
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 1rem",
                    borderBottom: "1px solid #dddddd",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "14px",
                        fontFamily: "'Inter', sans-serif",
                        color: "#000",
                        fontWeight: "500",
                    }}
                >
                    {editMaterialId ? "Edit Material" : "Add Material"}
                </Typography>
                <IconButton
                    sx={{ paddingInline: "0" }}
                    onClick={() => {
                        setOpenMaterialDrawer(false);
                        setAvailableQty("");
                        setAvailableUnits("");
                        setRequiredQty("");
                        setRequiredUnits("");
                        setName("");
                        setEditMaterialId("");
                        setErrorMessages({});
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <form className={styles.addmaterials} style={{ padding: "1rem" }}>
                <div className={styles.formfieldscontainer}>
                    <div className={styles.materialformfields}>
                        <label className={styles.label}>{"Material Name"}</label>
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
                                    width: "100%",
                                }}
                            />
                            <ErrorMessages errorMessages={errorMessages} keyname={"name"} />
                        </div>
                        <div className={styles.group}>
                            <div className={styles.required}>
                                <img
                                    className={styles.icon}
                                    alt=""
                                    src={"/procurement-1.svg"}
                                />
                                <div className={styles.row}>
                                    <TextField
                                        size="small"
                                        sx={{
                                            width: "100%",
                                            background: "#fff",
                                        }}
                                        placeholder="Required"
                                        variant="outlined"
                                        value={requiredQty}
                                        onInput={handleInput}
                                        onChange={(e: any) => setRequiredQty(e.target.value)}
                                    />
                                    <FormControl variant="outlined" sx={{ width: "100%" }}>
                                        <InputLabel color="primary" />
                                        <Select
                                            sx={{
                                                background: "#fff",
                                            }}
                                            size="small"
                                            defaultValue="Litres"
                                            value={requiredUnits}
                                            onChange={(e: any) => setRequiredUnits(e.target.value)}
                                        >
                                            <MenuItem value="Litres">Litres</MenuItem>
                                            <MenuItem value="Kilograms">Kilograms</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div
                                style={{
                                    marginLeft: "40px",
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "100%",
                                }}
                            >
                                <ErrorMessages
                                    errorMessages={errorMessages}
                                    keyname={"required_qty"}
                                />
                                <div style={{ marginLeft: "30%" }}>
                                    <ErrorMessages
                                        errorMessages={errorMessages}
                                        keyname={"required_units"}
                                    />
                                </div>
                            </div>

                            <div className={styles.required}>
                                <img className={styles.icon} alt="" src={"/approved-1.svg"} />
                                <div className={styles.row}>
                                    <TextField
                                        size="small"
                                        sx={{
                                            width: "100%",
                                            background: "#fff",
                                        }}
                                        placeholder="Availble"
                                        variant="outlined"
                                        value={availableQty}
                                        onInput={handleInput}
                                        onChange={(e: any) => setAvailableQty(e.target.value)}
                                    />
                                    <FormControl variant="outlined" sx={{ width: "100%" }}>
                                        <InputLabel color="primary" />
                                        <Select
                                            sx={{
                                                background: "#fff",
                                            }}
                                            size="small"
                                            defaultValue="Litres"
                                            value={requiredUnits}
                                            onChange={(e: any) => setRequiredUnits(e.target.value)}
                                        >
                                            <MenuItem value="Litres">Litres</MenuItem>
                                            <MenuItem value="Kilograms">Kilograms</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <div
                                style={{
                                    marginLeft: "40px",
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "100%",
                                }}
                            >
                                <ErrorMessages
                                    errorMessages={errorMessages}
                                    keyname={"available_qty"}
                                />
                                <div style={{ marginLeft: "30%" }}>
                                    <ErrorMessages
                                        errorMessages={errorMessages}
                                        keyname={"available_units"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={styles.buttons}
                    style={{ width: "100%", marginTop: "0" }}
                >
                    <Button
                        className={styles.cancel}
                        name="back"
                        size="medium"
                        variant="outlined"
                        onClick={() => {
                            setOpenMaterialDrawer(false);
                            setOpenMaterialDrawer(false);
                            setAvailableQty("");
                            setAvailableUnits("");
                            setRequiredQty("");
                            setRequiredUnits("");
                            setName("");
                            setEditMaterialId("");
                            setErrorMessages({});
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={styles.submit}
                        color="primary"
                        name="submit"
                        variant="contained"
                        onClick={() => {
                            if (editMaterialId) {
                                updateMaterialById();
                            } else {
                                addMaterial();
                            }
                        }}
                    >
                        {loading ? (
                            <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                        ) : (
                            "Submit"
                        )}{" "}
                    </Button>
                </div>
                {/* <ButtonGroup fillButton="Submit" buttonGroupGap="1rem" /> */}
                <LoadingComponent loading={loading} />
            </form>
        </Drawer>
    );
}
export default MobileAddMaterialDrawer;