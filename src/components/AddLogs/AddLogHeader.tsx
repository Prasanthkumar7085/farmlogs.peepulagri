import ButtonComponent from "@/components/Core/ButtonComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import styles from "./AddLogHeader.module.css";

const AddLogHeader = () => {
    const router = useRouter();
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                columnGap: "1rem",
                padding: "1rem 0"
            }}
        >
            <ButtonComponent
                direction={false}
                icon={<ArrowBackIcon />}
                size="small"
                onClick={() => router.back()}
                style={{ paddingInline: "0", minWidth: "auto" }}
            />
            <Typography variant="h6" className={styles.title}>{router.query.log_id ? 'Edit Log' : 'Add Log'}</Typography>
        </div>
    );
};

export default AddLogHeader;
