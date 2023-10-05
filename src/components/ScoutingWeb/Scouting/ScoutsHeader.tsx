import { FunctionComponent, useCallback } from "react";
import {
    TextField,
    Button,
    Autocomplete,
    Breadcrumbs,
    Link,
    Typography,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import styles from "../farms/FarmsNavBar.module.css";
import FarmDetailsMiniCard from "@/components/AddLogs/farm-details-mini-card";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const ScoutsNavBarWeb: FunctionComponent = () => {

    const router = useRouter();
    const farmTitle = useSelector((state: any) => state?.farms?.cropName);

    const onButtonClick = useCallback(() => {
        // Please sync "Add Farm " to the project
    }, []);

    return (
        <div className={styles.farmsnavbar}>

            <FarmDetailsMiniCard />
            {/* <div className={styles.actionsbar}>
                <Autocomplete
                    size='small'
                    placeholder="Select farm name"
                    disablePortal
                    id="combo-box-demo"
                    options={options}
                    renderInput={(params) => <TextField {...params} />}
                    sx={{
                        width: "350px",
                        maxWidth: "350px",
                        borderRadius: "4px",
                        background: "#fff",
                        "& .MuiInputBase-input ": {
                            fontSize: "13px",
                            fontWeight: "400",
                            fontFamily: "'inter', sans-serif ",
                            color: "#000",
                            paddingBlock: "3px !important"

                        }
                    }}
                />
                <Button
                    className={styles.button}
                    variant="contained"
                    onClick={onButtonClick}
                >
                    <AddIcon sx={{ fontSize: "1rem" }} />Add
                </Button>
            </div> */}
        </div>
    );
};

export default ScoutsNavBarWeb;
