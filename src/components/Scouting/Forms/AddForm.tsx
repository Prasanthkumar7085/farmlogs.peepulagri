import type { NextPage } from "next";
import { useCallback, useState } from "react";
import {
    TextField,
    Icon,
    Button,
} from "@mui/material";
import styles from "./add-farm-form1.module.css";
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import addFarmService from "../../../../lib/services/FarmsService/addFarmService";
import { useSelector } from "react-redux";
import LoadingComponent from "@/components/Core/LoadingComponent";
import AlertComponent from "@/components/Core/AlertComponent";




const AddFarmForm = () => {


    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [errorMessages, setErrorMessages] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);

    const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

    
    const onSubmitClick = async (data: any) => {
        setErrorMessages({});
        setLoading(true);
        
        const { location, title, area } = data;

        let obj = {
            title: title,
            area: area?+area:null,
            location: location
        };

        let response = await addFarmService(obj, accessToken);
        
        if (response?.success) {

            setAlertMessage(response?.message);
            setAlertType(true);

            setTimeout(() => {
                router.back();
            }, 1000);

        } else if (response?.status == 422) {

            setErrorMessages(response?.errors);

            setAlertMessage(response?.message);
            setAlertType(false);
        }
        setLoading(false);
    };

    const handleKeyPress = (event: any) => {
        const keyPressed = event.key;
        const allowedCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9','.'];

        if (!allowedCharacters.includes(keyPressed)) {
            event.preventDefault();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitClick)}>
            <div className={styles.addfarmform} id="add-farm">
                <div className={styles.formfields} id="form-fields">
                    <div className={styles.farmname} id="farm-name">
                        <div className={styles.label}>Farm Name</div>
                        <TextField
                            {...register('title')}
                            name='title'
                            fullWidth
                            className={styles.inputfarmname}
                            size="small"
                            placeholder="Enter Farm Name"
                            variant="outlined"
                            error={Boolean(errorMessages?.['title'])}
                            helperText={errorMessages?.['title'] ? errorMessages?.['title'] : ""}
                        />
                    </div>
                    <div className={styles.locationdetails} id="location-details">
                        {/* <div className={styles.addlocationbutton} id="add-location">
                            <div className={styles.locationheading} id="location-heading">
                                <div className={styles.text}>Location</div>
                                <div className={styles.supportingText}>
                                    You can add Manually or choose on map
                                </div>
                            </div>
                            <Button
                                className={styles.button}
                                variant="contained"
                                onClick={onButtonClick}
                            >
                                <MyLocationOutlinedIcon sx={{ fontSize: "12px" }} /> Locate On Map
                            </Button>
                        </div> */}
                        <div className={styles.farmname} id="enter-location">
                            <div className={styles.label}>Location</div>
                            <TextField
                                 {...register('location')}
                                className={styles.inputfarmname}
                                name="location"
                                size="small"
                                placeholder="Enter location here"
                                fullWidth
                                variant="outlined"
                                error={Boolean(errorMessages?.['location'])}
                                helperText={errorMessages?.['location'] ? errorMessages?.['location'] : ""}
                            />
                        </div>
                        <div className={styles.farmname} id="acres">
                            <div className={styles.label}>Total Land (acres)</div>
                            <TextField
                                 {...register('area')}
                                className={styles.inputfarmname}
                                name="area"
                                size="small"
                                placeholder="Enter acres"
                                fullWidth
                                type={'number'}
                                onWheel={(e:any) => e.target.blur()}
                                variant="outlined"
                                error={Boolean(errorMessages?.['area'])}
                                helperText={errorMessages?.['area'] ? errorMessages?.['area'] : ""}
                                onKeyPress={handleKeyPress}
                                inputProps={{
                                    step: 'any'
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.footeractionbuttons} id="footer-action-buttons">
                    <div className={styles.buttons}>
                        <Button
                            className={styles.back}
                            name="back"
                            size="medium"
                            variant="outlined"
                            onClick={()=>router.back()}
                        >
                            Back
                        </Button>
                        <Button
                            className={styles.submit}
                            color="primary"
                            name="submit"
                            variant="contained"
                            endIcon={<Icon>arrow_forward_sharp</Icon>}
                            type='submit'
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
            <LoadingComponent loading={loading} />
            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} mobile={true} />
        </form>
    );
};

export default AddFarmForm;
