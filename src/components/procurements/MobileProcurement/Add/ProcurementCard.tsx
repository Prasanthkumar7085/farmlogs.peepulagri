import { IconButton } from "@mui/material";
import styles from "./procurementCard.module.css"
const ProcurementCard = ({ item }: any) => {
    return (

        <div className={styles.procurementdetails} >
            <div className={styles.materialdetails}>
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
            <IconButton>
                Edit
            </IconButton>
        </div>
    )
}
export default ProcurementCard;