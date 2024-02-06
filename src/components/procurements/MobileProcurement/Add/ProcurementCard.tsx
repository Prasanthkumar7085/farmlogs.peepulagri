import { IconButton } from "@mui/material";
import styles from "./procurementCard.module.css"
import Image from "next/image";
import { useEffect, useState } from "react";
const ProcurementCard = ({ item, setEditMaterialId,
    setOpenMaterialDrawer,
    selectMaterial }: any) => {

    const [selectedItems, setSelectedItems] = useState<any>([]);
    const [tempItems, setTempItems] = useState(selectedItems);

    const handleChange = (itemId: any) => {
        const itemIndex = selectedItems.findIndex(
            (ite: any) => ite._id === itemId._id
        );

        if (itemIndex === -1) {
            setSelectedItems([...selectedItems, itemId]);
        } else {
            const updatedItems = selectedItems.filter(
                (item: any) => item._id !== itemId._id
            );
            setSelectedItems(updatedItems);
        }
    };

    useEffect(() => {
        if (selectMaterial == false) {
            setSelectedItems([])
        }
    }, [selectMaterial])
    return (

        <div className={styles.procurementdetails} >
            <div className={styles.materialdetails}>
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
                <p className={styles.procurement} >
                    Procurement : {item.required_qty} {item.required_units}
                </p>
            </div>
            <p className={styles.price} >
                ₹0.00
            </p>
            <IconButton className={styles.iconButton} onClick={() => {
                setOpenMaterialDrawer(true)
                setEditMaterialId(item?._id)
            }}>
                <Image src="/pencil-simple-line 1.svg" alt="edit" width={13} height={13} /> Edit
            </IconButton>

        </div>
    )
}
export default ProcurementCard;