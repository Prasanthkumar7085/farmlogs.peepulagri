import { FunctionComponent, useCallback } from "react";
import {
    TextField,
    Button,
    Autocomplete,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import styles from "../farms/FarmsNavBar.module.css";
import FarmDetailsMiniCard from "@/components/AddLogs/farm-details-mini-card";

const ScoutsNavBarWeb: FunctionComponent = () => {
    const onButtonClick = useCallback(() => {
        // Please sync "Add Farm " to the project
    }, []);
    const options = ['farm', 'farm2']

    return (
        <div className={styles.farmsnavbar}>
            <div className={styles.title}>
                <img className={styles.farmIcon} alt="" src="/wer-farm-page-icon.svg" />
                <h1 className={styles.farms}>Scouting</h1>
            </div>
            <FarmDetailsMiniCard/>
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
