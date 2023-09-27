import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
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
import getFarmByIdService from "../../../../lib/services/FarmsService/getFarmByIdService";
import { FarmDataType } from "@/types/farmCardTypes";
import editFarmService from "../../../../lib/services/FarmsService/editFarmService";




const AddFarmForm = () => {


    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [errorMessages, setErrorMessages] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [data, setData] = useState<FarmDataType>();

    const [title, setTitle] = useState<string>();
    const [location, setLocation] = useState<string>();
    const [area, setArea] = useState<string>();

    const geometryDemo={
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            [
                                -121.88883540217063,
                                50.97489195799901,
                                0
                            ],
                            [
                                -121.88883523174192,
                                50.97072525131302,
                                0
                            ],
                            [
                                -121.8950854466247,
                                50.97072527980969,
                                0
                            ],
                            [
                                -121.89508560169767,
                                50.97489198254216,
                                0
                            ]
                        ]
                    ]
                ]
            }

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: title,
            area: area ? +area : null,
            location: location
        }
    });

    const detailsAfterResponse = (response: any) => {
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
        } else {
            setAlertMessage('Failed while saving the Farm Details');
            setAlertType(false);
        }
    };

    const addFarm = async (data:any) => {
        const { location, title, area } = data;

        let obj = {
            title: title,
            area: area?+area:null,
            location: location,
            geometry:geometryDemo
        };

        let response = await addFarmService(obj, accessToken);
        detailsAfterResponse(response);
        setLoading(false);
    }
    const edtiFarm = async (obj: any) => {
        
        let editedData: any= { ...data };

        Object.keys(obj).map((item:string) => {
            editedData[item] = obj[item];
        })

        const response = await editFarmService(editedData, accessToken);
        detailsAfterResponse(response);
        setLoading(false);
        
    };

    const onSubmitClick = async (data: any) => {
        setErrorMessages({});
        setLoading(true);
        
        if (router.query.farm_id) {
            let obj = {
                title: title,
                location: location,
                area: area?+area:null,
                geometry:geometryDemo
            }
            edtiFarm(obj);
        } else {
            addFarm(data)
        }
       
    };

    const handleKeyPress = (event: any) => {
        const keyPressed = event.key;
        const allowedCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

        if (!allowedCharacters.includes(keyPressed)) {
            event.preventDefault();
        }
    };


  const getFarmDataById = async () => {
    setLoading(true);
    
    const response: any = await getFarmByIdService(router.query.farm_id as string,accessToken as string);
    
    if (response.success) {
        setData(response.data);
        
        setArea(response?.data?.area);
        setTitle(response?.data?.title);
        setLocation(response?.data?.location);
    }
    setLoading(false);
  }


    useEffect(() => {
        if (router.isReady && accessToken && router.query.farm_id) {
            getFarmDataById();
       }
    },[router.isReady,accessToken]);

    return (
        <form onSubmit={handleSubmit(onSubmitClick)}>
            <div className={styles.addfarmform} id="add-farm">
                <div className={styles.formfields} id="form-fields">
                    <div className={styles.farmname} id="farm-name">
                        <div className={styles.label}>Farm Name</div>
                        <TextField
                            sx={{
                                '& .MuiInputBase-root': {
                                    background: "#fff"
                                }
                            }}
                            {...register('title')}
                            name='title'
                            fullWidth
                            className={styles.inputfarmname}
                            size="small"
                            placeholder="Enter Farm Name"
                            variant="outlined"
                            error={Boolean(errorMessages?.['title'])}
                            helperText={errorMessages?.['title'] ? errorMessages?.['title'] : ""}
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                        />
                    </div>
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
                            sx={{
                                '& .MuiInputBase-root': {
                                    background: "#fff"
                                }
                            }}
                            {...register('location')}
                            className={styles.inputfarmname}
                            name="location"
                            size="small"
                            placeholder="Enter location here"
                            fullWidth
                            variant="outlined"
                            error={Boolean(errorMessages?.['location'])}
                            helperText={errorMessages?.['location'] ? errorMessages?.['location'] : ""}
                            value={location}
                            onChange={(e)=>setLocation(e.target.value)}
                        />
                    </div>
                    <div className={styles.farmname} id="acres">
                        <div className={styles.label}>Total Land (acres)</div>
                        <TextField
                            sx={{
                                '& .MuiInputBase-root': {
                                    background: "#fff"
                                }
                            }}
                            {...register('area')}
                            className={styles.inputfarmname}
                            name="area"
                            size="small"
                            placeholder="Enter acres"
                            fullWidth
                            type={'number'}
                            onWheel={(e: any) => e.target.blur()}
                            variant="outlined"
                            error={Boolean(errorMessages?.['area'])}
                            helperText={errorMessages?.['area'] ? errorMessages?.['area'] : ""}
                            onKeyPress={handleKeyPress}
                            inputProps={{
                                step: 'any'
                            }}
                            value={area}
                            onChange={(e)=>setArea(e.target.value)}
                        />
                    </div>
                    <div className={styles.buttons}>
                        <Button
                            className={styles.back}
                            name="back"
                            size="medium"
                            variant="outlined"
                            onClick={() => router.back()}
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
