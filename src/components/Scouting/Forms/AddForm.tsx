import type { NextPage } from "next";
import { useCallback } from "react";
import {
    TextField,
    InputAdornment,
    Icon,
    IconButton,
    Button,
} from "@mui/material";
import styles from "./add-farm-form1.module.css";

const AddFarmForm: NextPage = () => {
    const onButtonClick = useCallback(() => {
        // Please sync "1" to the project
    }, []);

    const onSubmitClick = useCallback(() => {
        // Please sync "Dashboard" to the project
    }, []);

    return (
        <div className={styles.addfarmform} id="add-farm">
            <div className={styles.formfields} id="form-fields">
                <div className={styles.farmname} id="farm-name">
                    <div className={styles.label}>Farm Name</div>
                    <TextField
                        className={styles.inputfarmname}
                        color="primary"
                        size="small"
                        placeholder="Enter Farm Name"
                        variant="outlined"
                    />
                </div>
                <div className={styles.locationdetails} id="location-details">
                    <div className={styles.addlocationbutton} id="add-location">
                        <div className={styles.locationheading} id="location-heading">
                            <div className={styles.text}>Location</div>
                            <div className={styles.supportingText}>
                                You can add Manually or choose on map
                            </div>
                        </div>
                        <Button
                            className={styles.button}
                            color="success"
                            variant="contained"
                            onClick={onButtonClick}
                        >
                            Locate On Map
                        </Button>
                    </div>
                    <div className={styles.farmname} id="enter-location">
                        <div className={styles.label1}>Location</div>
                        <TextField
                            className={styles.inputfarmname}
                            color="primary"
                            name="location"
                            size="small"
                            placeholder="Enter location here"
                            fullWidth={true}
                            variant="outlined"
                        />
                    </div>
                    <div className={styles.farmname} id="acres">
                        <div className={styles.label1}>Total Land (acres)</div>
                        <TextField
                            className={styles.inputfarmname}
                            color="primary"
                            name="location"
                            size="small"
                            placeholder="Enter acres"
                            fullWidth={true}
                            variant="outlined"
                        />
                    </div>
                </div>
            </div>
            <div className={styles.footeractionbuttons} id="footer-action-buttons">
                <div className={styles.buttons}>
                    <Button
                        className={styles.back}
                        sx={{ width: 130 }}
                        color="primary"
                        name="back"
                        size="medium"
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <Button
                        className={styles.submit}
                        color="primary"
                        name="submit"
                        variant="contained"
                        endIcon={<Icon>arrow_forward_sharp</Icon>}
                        onClick={onSubmitClick}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AddFarmForm;
