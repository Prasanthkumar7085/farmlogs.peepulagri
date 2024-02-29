import ErrorMessages from "@/components/Core/ErrorMessages";
import { Clear } from "@mui/icons-material";
import {
    Button,
    CircularProgress,
    Drawer,
    IconButton,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

import styles from "../add/materials-required.module.css";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import getSingleMaterilsService from "../../../../lib/services/ProcurementServices/getSingleMaterilsService";
import addMaterialParchaseService from "../../../../lib/services/ProcurementServices/addMaterialPurchaseService";
import LoadingComponent from "@/components/Core/LoadingComponent";


const ViewMaterialDrawer = ({ materialId, materialOpen, setMaterialOpen, getAllProcurementMaterials }: any) => {
    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<any>();
    const [nameVendor, setNameVendor] = useState('');
    const [price, setPrice] = useState<any>();
    const [errorMessages, setErrorMessages] = useState({});
    const getSingleMaterials = async () => {
        setLoading(true);
        try {
            let response = await getSingleMaterilsService({
                token: accessToken,
                procurementId: materialId,
            });
            if (response?.status == 200 || response?.status == 201) {
                setMaterials(response?.data);
                setNameVendor(response?.data?.vendor);
                setPrice(response?.data?.price);
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
                id: materialId
            });

            if (response?.status == 200 || response?.status == 201) {
                if (materials?.price && materials?.vendor) {
                    toast.success("Vendor Details updated succesfully");

                }
                else {
                    toast.success(response?.message);

                }

                getAllProcurementMaterials();
                setNameVendor('');
                setPrice('');
                setMaterialOpen(false)
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

    useEffect(() => {

        if (materialOpen) {
            getSingleMaterials();
        } else {
            setNameVendor('');
            setPrice('')
        }
    }, [materialOpen])

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
        event.target.value = value.slice(0, 10);
    };

    return (
        <Drawer anchor={"right"} open={materialOpen}>
            <div className={styles.addMaterialDrawer} >
                <div className={styles.drawerHeaderBlock} >
                    <h3 className={styles.drawerHeading}>{materials?.price && materials?.vendor ? "Edit Purchase" : "Add Purchase"}</h3>
                    <IconButton
                        onClick={() => {
                            setMaterialOpen(false);
                            setErrorMessages({});
                        }}
                    >
                        <Clear sx={{ color: "#000", fontSize: "1.5rem", fontWeight: "200" }} />
                    </IconButton>
                </div>
                <div className={styles.inputField}>
                    <label className={styles.label}>
                        Material Name <b style={{ color: "red" }}>*</b>
                    </label>
                    <TextField
                        className={styles.input}
                        placeholder="Please enter the material title"
                        disabled
                        size="small"
                        variant="outlined"
                        value={materials?.name}
                    />

                </div>
                <div className={styles.inputField}>
                    <label className={styles.label}>
                        Material Procurement (Qty){" "}
                        <strong style={{ color: "red" }}>*</strong>
                    </label>
                    <TextField
                        sx={{
                            width: "100%", background: "#fff",
                            '& .MuiInputBase-root': {
                                paddingRight: "0 !important"
                            },
                            '& .MuiOutlinedInput-root': {
                                paddingRight: "0 !important"
                            }
                        }} type="number"
                        disabled
                        size="small"
                        // defaultValue={materials?.required_qty + " " + materials?.required_units}
                        value={materials?.required_qty}
                        InputProps={{
                            endAdornment: (
                                <Select
                                    sx={{
                                        background: "#fff",
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderWidth: "1px 1px 1px 0 !important",
                                            borderRadius: "1px 4px 4px 0 !important",

                                        }
                                    }}
                                    size="small"
                                    disabled
                                    value={materials?.required_units}

                                >
                                    <MenuItem value="Litres">Litres</MenuItem>
                                    <MenuItem value="Kilograms">Kilograms</MenuItem>
                                </Select>
                            ),
                        }}

                    />
                </div>

                <div className={styles.inputField}>
                    <label className={styles.label}>
                        Material Available (Qty)(optional)
                    </label>
                    <TextField
                        disabled
                        sx={{
                            width: "100%", background: "#fff",
                            '& .MuiInputBase-root': {
                                paddingRight: "0 !important"
                            },
                            '& .MuiOutlinedInput-root': {
                                paddingRight: "0 !important"
                            }
                        }}
                        type="number"
                        size="small"
                        value={materials?.available_qty}
                        InputProps={{
                            endAdornment: (
                                <Select
                                    sx={{
                                        background: "#fff",
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderWidth: "1px 1px 1px 0 !important",
                                            borderRadius: "1px 4px 4px 0 !important",

                                        }
                                    }}
                                    size="small"
                                    disabled
                                    value={materials?.available_units}

                                >
                                    <MenuItem value="Litres">Litres</MenuItem>
                                    <MenuItem value="Kilograms">Kilograms</MenuItem>
                                </Select>
                            ),
                        }}
                    />

                </div>
                <div className={styles.inputField}>
                    <label className={styles.label}>
                        Vendor Details <b style={{ color: "red" }}>*</b>
                    </label>
                    <TextField
                        size="small" placeholder="Enter Vendor Details"
                        variant="outlined"
                        rows={5}
                        multiline
                        sx={{ width: "100%", height: "40%" }}
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
                <div className={styles.inputField}>
                    <label className={styles.label}>
                        Price (Rs) <b style={{ color: "red" }}>*</b>
                    </label>
                    <TextField
                        size="small"
                        sx={{ width: "100%" }}
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
                <div className={styles.drawerBtngroup}>
                    <Button
                        className={styles.cancelBtn}
                        variant="outlined"
                        onClick={() => {

                            setMaterialOpen(false);
                            setErrorMessages({});

                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className={styles.submitBtn}
                        variant="contained"
                        onClick={() => {
                            if (materials?.price && materials?.vendor) {
                                addMaterial();
                            } else {
                                addMaterial();
                            }
                        }}
                    >
                        {materials?.price && materials?.vendor ? "Update" : "Submit"}
                    </Button>
                </div>
                <LoadingComponent loading={loading} />

            </div>
        </Drawer>
    );
};

export default ViewMaterialDrawer;
