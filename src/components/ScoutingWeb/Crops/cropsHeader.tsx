import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
    TextField,
    Button,
    Autocomplete,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import styles from "../farms/FarmsNavBar.module.css";
import { useRouter } from "next/router";
import { FarmDataType } from "@/types/farmCardTypes";

interface pageProps{
    options: Array<FarmDataType>;
    captureFarmData: (item: FarmDataType | null) => void;
    farmSelected: FarmDataType| null | undefined
}

const CropsNavBarWeb = ({options,captureFarmData,farmSelected}:pageProps) => {

    const router = useRouter();

    const [loadOnChange, setLoadOnChange] = useState(false);
    
    useEffect(() => {
        setLoadOnChange(true);
        setTimeout(() => {
            setLoadOnChange(false);
        }, 1);
    },[farmSelected])

    return (
        <div className={styles.farmsnavbar}>

            <div className={styles.title}>

                <div className={styles.iconDiv} style={{ cursor:"pointer" }} onClick={()=>router.back()}>
                    <img src="/arrow-left-back.svg" alt="" width={'18px'} />
                </div>

                <img className={styles.farmIcon} alt="" src="/wer-farm-page-icon.svg" />
                <h1 className={styles.farms}>My Crops</h1>
            </div>
            <div className={styles.actionsbar}>
                {!loadOnChange?<Autocomplete
                    size='small'
                    placeholder="Select farm name"
                    disablePortal
                    id="combo-box-demo"
                    options={options}
                    getOptionLabel={(options)=>options.title}
                    renderInput={(params) => <TextField {...params} />}
                    value={farmSelected}
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
                    onChange={(e: any, item: any, reason: any) => captureFarmData(item)}
                />:""}
                {/* <Button
                    className={styles.button}
                    variant="contained"
                    onClick={onButtonClick}
                >
                    <AddIcon sx={{ fontSize: "1rem" }} />Add
                </Button> */}
            </div>
            
        </div>
    );
};

export default CropsNavBarWeb;
