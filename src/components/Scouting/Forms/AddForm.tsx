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
import addLocationService from "../../../../lib/services/Locations/addLocationService";




const AddFarmForm = () => {


    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
    
    const [errorMessages, setErrorMessages] = useState<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [data, setData] = useState<FarmDataType>();
    
    const [title, setTitle] = useState<string>('');
    const [location, setLocation] = useState<{ name: string, _id: string }|null>();
    const [area, setArea] = useState<string>();
    
    
    const [open, setOpen] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(false);
    
    const [locations, setLocations] = useState<Array<{name:string,_id:string}>>([]);
    
    const [addLocationOpen, setAddLocationOpen] = useState(false);
    
    const [hiddenLoading, setHiddenLoading] = useState(false);
    const [settingLocationLoading, setSettingLocationLoading] = useState(false);
    const [addLocationLoading, setAddLocationLoading] = useState(false);

    const [newLocation, setNewLocation] = useState('');


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

        let obj = {
            title: title,
            location: location?.name,
            area: area ? +area : null,
            geometry: geometryDemo
        }
        if (router.query.farm_id) {
            edtiFarm(obj);
        } else {
            addFarm(obj);
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
            const locationFromResponse = response?.data?.location;
            // const locationObjFromResponse = locationFromResponse.find((item: {name:string,_id:string})=>item.name==locationFromResponse);
            // setLocation(locationObjFromResponse);
            await getLocations(locationFromResponse);
        }
        setLoading(false);
    }


    useEffect(() => {
        if (router.isReady && accessToken) {
            if (router.query.farm_id) {
                getFarmDataById();            
            } else if (router.query.location) {
                getLocations(router.query.location as string);
            }
        }
    }, [router.isReady, accessToken,router.query.location]);



    useEffect(() => {

        setHiddenLoading(true);
        setTimeout(() => {
            setHiddenLoading(false);
        }, 1)

    }, [data]);



    const getLocations = async (newLocation = '') => {
        
        setOptionsLoading(true);
        try {
            const response = await getAllLocationsService(accessToken);
            if (response?.success) {
                setLocations(response?.data);
                if (newLocation) {
                    setSettingLocationLoading(true);
                    const newLocationObject = response?.data?.find((item: any) => item?.name == newLocation);
                    setLocation(newLocationObject);
                    setTimeout(() => {
                        setSettingLocationLoading(false);
                    }, 1);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setOptionsLoading(false);
        }
    }

    

    const addInputValue = (e: any, newValue: string) => {
        setNewLocation(newValue);
    };


    const captureResponseDilog = (value: any) => {
        setErrorMessages([]);
        if (value == false) {
            setAddLocationOpen(false);
            setNewLocation('')
        }
        else {
            addNewLocation(value);
        }
    }


    const addNewLocation = async (location: string) => {
        setAddLocationLoading(true);
        
        const response = await addLocationService({ name: location }, accessToken);
        if (response?.success) {
            setAlertMessage(response?.message);
            setAlertType(true);
            setAddLocationOpen(false);
            
            getLocations(response?.data?.name);
            setNewLocation('');
        } else if (response?.status==422) {
            setErrorMessages(response?.errors)
        } else {
            setAlertMessage(response?.message);
            setAlertType(false);
        }
        setAddLocationLoading(false);
    }

    return (
        <form onSubmit={handleSubmit(onSubmitClick)}>
            {!loading?<div className={styles.addfarmform} id="add-farm">
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
                            <span>Location<span style={{ color: "red" }}>*</span></span> <span style={{ color: "#3276c3" }} onClick={() => { setNewLocation(''); setAddLocationOpen(true)}}>+ Add Location</span>
                        </div>

                        {!hiddenLoading && !settingLocationLoading ? <Autocomplete
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
                            noOptionsText={<div>{'No such location!'} <span style={{color:"blue"}}  onClick={()=>setAddLocationOpen(true)}>Add New?</span></div>}
                            value={location}
                            isOptionEqualToValue={(option, value) => option.name === value.name}
                            getOptionLabel={(option:{name:string,_id:string}) => option.name}
                            options={locations}
                            loading={optionsLoading}
                            onInputChange={addInputValue}
                            onChange={(e: any, value: any, reason: any) => {
                                if (reason == "clear") {
                                    setLocation(null);
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
            </div>:""}
            <LoadingComponent loading={loading} />
            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} mobile={true} />
            <AddLocationDialog
                open={addLocationOpen}
                captureResponseDilog={captureResponseDilog}
                defaultTitle={newLocation}
                errorMessages={errorMessages}
                loading={addLocationLoading}
            />
        </form>
    );
};

export default AddFarmForm;
