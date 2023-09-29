import type { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import {
    TextField,
    Icon,
    Button,
    Autocomplete,
    CircularProgress,
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
import getAllLocationsService from "../../../../lib/services/Locations/getAllLocationsService";
import AddLocationDialog from "@/components/Core/AddLocationDialog/AddLocationDialog";




const AddFarmForm = () => {


    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [errorMessages, setErrorMessages] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [data, setData] = useState<FarmDataType>();

    const [title, setTitle] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [area, setArea] = useState<string>();


    const [open, setOpen] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(false);

    const [locations, setLocations] = useState<Array<string>>([]);

    const [addLocationOpen, setAddLocationOpen] = useState(false);

    const geometryDemo = {
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
            console.log(response);
            

            setTimeout(() => {
                router.push(`/farms?location=${response?.data?.location}`);
            }, 1000);

        } else if (response?.status == 422) {
            if (response?.errors) {
                setErrorMessages(response?.errors);
            } else {
                setErrorMessages({ title: response?.message });
            }
        } else {
            setAlertMessage('Failed while saving the Farm Details');
            setAlertType(false);
        }
    };

    const addFarm = async (data: any) => {
        const { location, title, area } = data;

        let obj = {
            title: title,
            area: area ? +area : null,
            location: location.trim(),
            geometry: geometryDemo
        };

        let response = await addFarmService(obj, accessToken);
        detailsAfterResponse(response);
        setLoading(false);
    }
    const edtiFarm = async (obj: any) => {

        let editedData: any = { ...data };

        Object.keys(obj).map((item: string) => {
            editedData[item] = obj[item];
        })

        const response = await editFarmService(editedData, accessToken, router.query.farm_id as string);
        detailsAfterResponse(response);
        setLoading(false);

    };

    const onSubmitClick = async (data: any) => {
        setErrorMessages({});
        setLoading(true);

        if (router.query.farm_id) {
            let obj = {
                title: title,
                location: location.trim(),
                area: area ? +area : null,
                geometry: geometryDemo
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

        const response: any = await getFarmByIdService(router.query.farm_id as string, accessToken as string);

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
            getLocations();
        }
    }, [router.isReady, accessToken]);


    const [hiddenLoading, setHiddenLoading] = useState(false);

    useEffect(() => {

        setHiddenLoading(true);
        setTimeout(() => {
            setHiddenLoading(false);
        }, 1)

    }, [data]);



    const getLocations = async () => {
        setOptionsLoading(true);
        try {
            const response = await getAllLocationsService(accessToken);
            if (response?.success) {
                setLocations(response?.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setOptionsLoading(false);
        }
    }

    const addInputValue = (e: any, newValue: string) => {
        setLocation(newValue);

        if (newValue.trim() !== '' && !locations.includes(newValue) && !locations.every(str => str.includes(newValue))) {
            setLocations([...locations, newValue]);
        }
    };

    const captureResponseDilog = (value: any) => {
        if (value == false) {
            setAddLocationOpen(false)
            setErrorMessages([]);
        }
        else {
            setErrorMessages([]);
            addNewLocation(value);
        }
    }

    const addNewLocation = async (location:string) => {
        console.log(location,'location');
        
    }

    return (
        <form onSubmit={handleSubmit(onSubmitClick)}>
            <div className={styles.addfarmform} id="add-farm">
                <div className={styles.formfields} id="form-fields">
                    <div className={styles.farmname} id="farm-name">
                        <div className={styles.label}> Title<span style={{color:"red"}}>*</span></div>
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
                            placeholder="Enter Title"
                            variant="outlined"
                            error={Boolean(errorMessages?.['title'])}
                            helperText={errorMessages?.['title'] ? errorMessages?.['title'] : ""}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                        <div className={styles.label} style={{ display: "flex", justifyContent: "space-between",width:"100%" }}>
                            <span>Location<span style={{color:"red"}}>*</span></span> <span style={{ color: "#a4a6a9" }}>(You can enter new location)</span>
                        </div>

                        {!hiddenLoading ? <Autocomplete
                            id="asynchronous-demo"
                            open={open}
                            fullWidth
                            onOpen={() => {
                                getLocations();
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            // noOptionsText={<div>{'No such location!'} <span style={{color:"blue"}}  onClick={()=>setAddLocationOpen(true)}>Add New?</span></div>}
                            value={location}
                            isOptionEqualToValue={(option, value) => option === value}
                            getOptionLabel={(option) => option}
                            options={locations}
                            loading={optionsLoading}
                            onInputChange={addInputValue}
                            onChange={(e: any, value: any, reason: any) => {
                                if (reason == "clear") {
                                    setLocation('');
                                }
                                if (value) {
                                    setLocation(value);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {optionsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
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
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            background: "#fff"
                                        }
                                    }}

                                />
                            )}
                        /> : ""}
                        {/* <TextField
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
                        /> */}
                    </div>
                    <div className={styles.farmname} id="acres">
                        <div className={styles.label}>Total Land (acres)<span style={{color:"red"}}>*</span></div>
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
                            placeholder="Enter total area"
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
                            onChange={(e) => setArea(e.target.value)}
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
            <AddLocationDialog open={addLocationOpen} captureResponseDilog={captureResponseDilog} defaultTitle={location} />
        </form>
    );
};

export default AddFarmForm;
