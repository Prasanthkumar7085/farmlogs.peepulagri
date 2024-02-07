import { Button, IconButton } from "@mui/material";
import styles from "./procurementCard.module.css"
import Image from "next/image";
import { useEffect, useState } from "react";
import formatMoney from "@/pipes/formatMoney";
import ImageComponent from "@/components/Core/ImageComponent";
import { useSelector } from "react-redux";
import MobileViewMaterialDrawer from "@/components/Core/MobileViewMaterialDrawer";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import RejectedReasonDrawer from "../../MaterialCore/RejectReasonDrawer";
import { toast } from "sonner";
import InfoIcon from '@mui/icons-material/Info';
import MobileAddMaterialDrawer from "@/components/Core/MobileAddMaterialDrawer";
import RejectedTextDrawer from "../../MaterialCore/RejectTextDrawer";

const ProcurementCard = ({ procurementData, item,
    selectMaterial,
    onStatusChangeEvent,
    getAllProcurementMaterials,
    procurementStatusChange,
    materials,
    collectMaterialsForDelete
}: any) => {


    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const [rejectedReasonTextOpen, setRejectReasonTextOpen] = useState<boolean>(false)
    const [reasonText, setReasonText] = useState<boolean>(false)
    const [openMaterialDrawer, setOpenMaterialDrawer] = useState<boolean>()
    const [editMaterialId, setEditMaterialId] = useState("");
    const [editMaterialOpen, setEditMaterialOpen] = useState<boolean>()
    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [tempItems, setTempItems] = useState(selectedItems);
    const [materialId, setMaterialId] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [materialOpen, setMaterialOpen] = useState(false);
    const [rejectDilogOpen, setRejectDilogOpen] = useState<boolean>(false)
    const [selectedRow, setSelectedRow] = useState<any>()
    const [loading, setLoading] = useState<boolean>(false)
    const userDetails = useSelector(
        (state: any) => state.auth.userDetails?.user_details
    );

    const handleChange = (itemId: any) => {
        const itemIndex = selectedItems.findIndex(
            (ite: any) => ite._id === itemId._id
        );

        if (itemIndex === -1) {
            setSelectedItems([...selectedItems, itemId]);
            collectMaterialsForDelete([...selectedItems, itemId?._id])

        } else {
            const updatedItems = selectedItems.filter(
                (item: any) => item._id !== itemId._id
            );
            setSelectedItems(updatedItems);
            collectMaterialsForDelete(updatedItems)
        }
    };

    const afterRejectingMaterial = async (value: any) => {
        if (value) {
            setLoading(true)
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL}/procurement-requests/materials/${selectedRow}/${"reject"}`;

                const options = {
                    method: "PATCH",
                    body: JSON.stringify({
                        reason: value
                    }),
                    headers: new Headers({
                        'content-type': 'application/json',
                        'authorization': accessToken
                    }),
                }
                const response: any = await fetch(url, options);
                const responseData = await response.json();
                if (response.ok) {
                    toast.success(responseData?.message)

                    const rejectedData = materials.filter((item: any, index: number) => item?.status == "REJECTED");


                    if (rejectedData.length == materials.length - 1) {
                        procurementStatusChange("PENDING")
                    }

                    getAllProcurementMaterials()

                } else {
                    return { message: 'Something Went Wrong', status: 500, details: responseData }
                }

            } catch (err: any) {
                console.error(err);
            }
            finally {
                setLoading(false)
            }
        }

    }

    useEffect(() => {
        if (selectMaterial == false) {
            setSelectedItems([])
        }
    }, [selectMaterial])
    return (

        <div className={styles.procurementdetails} >
            <div className={styles.materialdetails}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {selectMaterial ? (
                        <input
                            style={{
                                width: "18px",
                                height: "18px",
                                border: "1px solid #000",
                            }}
                            type="checkbox"
                            checked={selectedItems.some(
                                (ite: any) => ite._id === item._id
                            )}
                            onChange={() => handleChange(item)}
                            title={item.id}
                        />
                    ) : (
                        ""
                    )}
                    <h2 className={styles.materialname} >
                        {item?.name}
                    </h2>
                </div>
                <p className={styles.procurement} >
                    Procurement : {item.required_qty} {item.required_units}
                </p>
            </div>
            <p className={styles.price} style={{ display: item.status == "REJECTED" || !item.price ? "none" : "" }}
            >
                {formatMoney(item?.price)}
            </p>
            {item?.status !== "PENDING" && item?.status !== "REJECTED" ? "" :
                <IconButton
                    sx={{ display: item.status == "REJECTED" ? "none" : "" }}
                    className={styles.iconButton} onClick={() => {
                        setEditMaterialOpen(true)
                        setEditMaterialId(item?._id)

                    }}>
                    <Image src="/pencil-simple-line 1.svg" alt="edit" width={13} height={13} /> Edit
                </IconButton>}

            {item?.status == "REJECTED" ?
                <IconButton
                    onClick={() => {
                        setRejectReasonTextOpen(true)
                        setEditMaterialId(item?._id)
                        setReasonText(item)

                    }}>
                    <InfoIcon />
                </IconButton> : ""}

            {userDetails?.user_type == "central_team" || userDetails?.user_type == "manager" ?
                <>
                    {item?.status !== "PENDING" ?
                        <IconButton
                            className={styles.iconButton}
                            sx={{
                                display: item?.status == "REJECTED" || (item?.price && item?.vendor) ? "none" : "", background: item?.price && item?.vendor ? "#D94841" : "#56CCF2",
                                "&:hover": {
                                    background: item?.price && item?.vendor ? "#D94841" : "#56CCF2",
                                },

                            }}

                            onClick={() => {
                                setOpenMaterialDrawer(true)
                                setEditMaterialId(item?._id)
                                setOpenMaterialDrawer(true)
                            }
                            }
                        >
                            <CurrencyRupeeIcon />  {item?.price && item?.vendor ? "Edit " : "Add "}

                        </IconButton>
                        :
                        ""}


                    <div style={{ cursor: "pointer", display: procurementData?.status == "PURCHASED" ? "none" : "" }}>
                        <IconButton

                            sx={{ display: item?.approved_by?.name ? "none" : "" }}
                            onClick={() => {
                                if (item?.status == "REJECTED") {

                                    onStatusChangeEvent("approve", item?._id)
                                }
                                else {
                                    setRejectDilogOpen(true)
                                    setSelectedRow(item?._id)
                                }
                            }
                            }
                        >
                            {item?.status == "REJECTED" ? <ImageComponent
                                src={
                                    "/viewProcurement/procurement-approve-icon.svg"
                                }
                                height={19}
                                width={19}
                                alt=""
                            /> : <ImageComponent
                                src={
                                    "/viewProcurement/procurement-reject-icon.svg"
                                }
                                height={17}
                                width={17}
                                alt=""
                            />}
                        </IconButton>
                    </div>
                </>
                : ""}

            <MobileViewMaterialDrawer
                openMaterialDrawer={openMaterialDrawer}
                setOpenMaterialDrawer={setOpenMaterialDrawer}
                procurementData={procurementData}
                editMaterialId={editMaterialId}
                setEditMaterialId={setEditMaterialId}
                getAllProcurementMaterials={getAllProcurementMaterials}
            />

            <RejectedReasonDrawer
                dialog={rejectDilogOpen}
                setRejectDilogOpen={setRejectDilogOpen}
                afterRejectingMaterial={afterRejectingMaterial}
                rejectLoading={loading}
            />
            <RejectedTextDrawer
                rejectedReasonText={rejectedReasonTextOpen}
                setRejectReasonTextOpen={setRejectReasonTextOpen}
                reasonText={reasonText}
            />

            <MobileAddMaterialDrawer
                openMaterialDrawer={editMaterialOpen}
                setOpenMaterialDrawer={setEditMaterialOpen}
                procurementData={procurementData}
                getAllProcurementMaterials={getAllProcurementMaterials}
                editMaterialId={editMaterialId}
                setEditMaterialId={setEditMaterialId}
            />

        </div>
    )
}
export default ProcurementCard;