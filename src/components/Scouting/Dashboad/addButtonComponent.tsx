import { IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";

const AddButtonComponent = ({ icon, title, link }: any) => {
    const router = useRouter()
    return (
        <div>
            <div className="addFormPositionIcon">
                <IconButton
                    size="large"
                    // className={styles.AddFarmBtn}
                    aria-label="add to shopping cart"
                    onClick={() => {
                        router.push(link);
                    }}
                >
                    <img style={{ fontSize: "2rem" }} src={icon} />
                    <Typography variant="caption">{title}</Typography>
                </IconButton>
            </div>
        </div>
    );
}

export default AddButtonComponent;