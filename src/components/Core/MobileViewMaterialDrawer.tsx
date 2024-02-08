import { Button, CircularProgress, Drawer, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "/src/components/procurements/MobileProcurement/Add/add-materials.module.css";
import ErrorMessages from "./ErrorMessages";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import getSingleMaterilsService from "../../../lib/services/ProcurementServices/getSingleMaterilsService";
import addMaterialParchaseService from "../../../lib/services/ProcurementServices/addMaterialPurchaseService";
import Image from "next/image";


interface ApiCallService {
    procurement_req_id: string;
    name: string;
    required_qty: number | null;
    required_units: string;
    available_qty?: number | null;
    available_units?: string;
}


const MobileViewMaterialDrawer = ({
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
    const [nameVendor, setNameVendor] = useState('');
    const [price, setPrice] = useState<any>();

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
    const [updateLoading, setUpdateLoading] = useState(false);
    const [editErrorMessages, setEditErrorMessages] = useState({});

    const addMaterial = async () => {
        setLoading(true);
        setErrorMessages({});
        try {
            const body = {
                price: +price,
                vendor: nameVendor
            };
            const response = await addMaterialParchaseService({
                token: accessToken,
                body: body,
                id: editMaterialId
            });

            if (response?.status == 200 || response?.status == 201) {


                toast.success(response?.message);
                setOpenMaterialDrawer(false)
                getAllProcurementMaterials();
                setNameVendor('');
                setPrice('');
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
        setUpdateLoading(true);
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
                setPrice(response?.data?.price)
                setNameVendor(response?.data?.vendor)
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
        if (editMaterialId && accessToken) {
            getSingleMaterials();
        }
        else {
            setAvailableQty("");
            setAvailableUnits("");
            setRequiredQty("");
            setRequiredUnits("");
            setName("");
            setPrice("")
            setNameVendor("")
        }
    }, [editMaterialId, accessToken])





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
        event.target.value = value.slice(0, 10);
    };


    return (
        <Drawer
            anchor={"bottom"}
            open={openMaterialDrawer}
            sx={{
                zIndex: "1300 !important",
                '& .MuiPaper-root': {
                    width: "100%", maxWidth: "500px", margin: "0 auto", borderRadius: "20px 20px 0 0 "
                }
            }}
        >
            <div className={styles.addPurchaseDrawerHeader}           >
                <Typography >{"Add Purchase "}</Typography>
                <IconButton
                    onClick={() => {
                        setOpenMaterialDrawer(false);
                        setAvailableQty("");
                        setAvailableUnits("");
                        setRequiredQty("");
                        setRequiredUnits("");
                        setName("");
                        setEditMaterialId("")

                    }}
                >
                    <CloseIcon />
                </IconButton>
            </div>
            <form className={styles.addmaterials} style={{ padding: "1rem" }}>
                <div className={styles.formfieldscontainer}>

                    <div className={styles.materialformfields}>

                        <div style={{ width: "100%" }}>
                            <label className={styles.label} >
                                {"Material Name"}
                            </label>
                            <TextField
                                size="small"
                                disabled
                                placeholder="Please enter the material title"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{
                                    background: "#fff",
                                    borderRadius: "4px",
                                    width: "100%", marginTop: "5px"
                                }}
                            />
                            <ErrorMessages errorMessages={errorMessages} keyname={"name"} />
                        </div>
                        <div className={styles.group}>
                            <div className={styles.required} >
                                <Image className={styles.icon} width={25} height={25} alt="" src={"/procurement-1.svg"} />
                                <div className={styles.row} >
                                    <TextField
                                        disabled
                                        size="small"
                                        sx={{
                                            width: "100%", background: "#fff",

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
                                            disabled
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
                            <div className={styles.required} >
                                <Image className={styles.icon} width={25} height={25} alt="" src={"/approved-1.svg"} />
                                <div className={styles.row} >
                                    <TextField
                                        disabled
                                        size="small"
                                        sx={{
                                            width: "100%", background: "#fff",

                                        }}
                                        placeholder="Required"
                                        variant="outlined"
                                        value={availableQty}
                                        onInput={handleInput}
                                        onChange={(e: any) => setAvailableQty(e.target.value)}
                                    />
                                    <FormControl variant="outlined" sx={{ width: "100%" }}>
                                        <InputLabel color="primary" />
                                        <Select
                                            disabled
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

                            <div style={{ width: "100%", marginTop: "10px" }}>
                                <label className={styles.label}>
                                    Vendor Details <b style={{ color: "red" }}>*</b>
                                </label>
                                <TextField
                                    size="small" placeholder="Enter Name Of Vendor"
                                    variant="outlined"
                                    rows={5}
                                    multiline
                                    sx={{ width: "100%", height: "30%", marginTop: "5px" }}
                                    value={nameVendor}
                                    onChange={(e) => {
                                        setNameVendor(e.target.value)
                                    }}
                                />

                                <ErrorMessages
                                    errorMessages={errorMessages}
                                    keyname={"vendor"}
                                />
                            </div>

                            <div style={{ width: "100%", marginTop: "10px" }}>
                                <label className={styles.label}>
                                    Price (Rs) <b style={{ color: "red" }}>*</b>
                                </label>
                                <TextField
                                    size="small"
                                    sx={{ width: "100%", marginTop: "5px" }}
                                    placeholder="Enter Price Details Here"
                                    variant="outlined"
                                    onInput={handleInput}
                                    value={price}
                                    onChange={(e) => {
                                        setPrice(e.target.value)
                                    }}

                                />
                                <ErrorMessages
                                    errorMessages={errorMessages}
                                    keyname={"price"}
                                />
                            </div>



                        </div>

                    </div>

                </div>

                <div className={styles.buttons}>
                    <Button
                        className={styles.cancel}
                        name="back"
                        size="medium"
                        variant="outlined"
                        onClick={() => {
                            setOpenMaterialDrawer(false)
                            setOpenMaterialDrawer(false);
                            setAvailableQty("");
                            setAvailableUnits("");
                            setRequiredQty("");
                            setRequiredUnits("");
                            setName("");
                            setEditMaterialId("")

                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={styles.submit}
                        color="primary"
                        name="submit"
                        variant="contained"
                        disabled={loading ? true : false}
                        onClick={() => {

                            addMaterial()

                        }}
                    >

                        {loading ?
                            <CircularProgress size="1.3rem" sx={{ color: "white" }} />
                            : 'Submit'}
                    </Button>
                </div>
                {/* <ButtonGroup fillButton="Submit" buttonGroupGap="1rem" /> */}
            </form>
        </Drawer >
    )
}
export default MobileViewMaterialDrawer;