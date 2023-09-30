import React, { useEffect, useState } from "react";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Box, Drawer, FormControl, FormHelperText, IconButton, InputLabel, ListItem, Menu, MenuItem, Typography } from "@mui/material";
import styles from "./crop-card.module.css";
import CropCard from "./CropCard";
import AddIcon from '@mui/icons-material/Add';
import NewFolderDiloag from "@/components/Core/AddCropalert/AddNewFolder";
import LoadingComponent from "@/components/Core/LoadingComponent";
import AlertComponent from "@/components/Core/AlertComponent";
import SelectAutoCompleteForFarms from "@/components/Core/selectDropDownForFarms";
import { removeTheFilesFromStore, setFarmTitleTemp } from "@/Redux/Modules/Farms";
import SortIcon from '@mui/icons-material/Sort';
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import DoneIcon from '@mui/icons-material/Done';
import { id } from "date-fns/locale";

const AllCropsComponent = () => {
    
    const router = useRouter();
    const dispatch = useDispatch();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [defaultValue, setDefaultValue] = useState<any>('');
    const [formId, setFormId] = useState<any>()
    const [formOptions, setFarmOptions] = useState<any>();
    const [cropOptions, setCropOptions] = useState<any>()
    const [dilogOpen, setDilogOpen] = useState<any>()
    const [loading, setLoading] = useState<any>(true)
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [loadingForAdd, setLoadingForAdd] = useState<any>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const [state, setState] = useState({ bottom: false });
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortType, setSortType] = useState('desc');

    const getFarmDetails = async (id: any) => {
        setLoading(true)
        let response = await getAllFarmsService(accessToken);

        try {
            if (response?.success == true && response?.data?.length) {
                setFarmOptions(response?.data);
                if (id) {
                    let selectedObject = response?.data?.length && response?.data?.find((item: any) => item._id == id);
                    setDefaultValue(selectedObject?.title)
                    dispatch(setFarmTitleTemp(selectedObject?.title));
                    captureFarmName(selectedObject);

                } else {
                    setDefaultValue(response?.data[0].title);
                    dispatch(setFarmTitleTemp(response?.data[0].title));
                    captureFarmName(response?.data[0]);
                }
            } else {
                setFarmOptions([]);
                setLoading(false)
            }
        } catch (err) {
            console.error(err);
            setLoading(false)
        }

    }

    //get all crops name
    const getCropsDetails = async (id: string,orderBy=sortBy,orderType=sortType) => {
        setLoading(true)

        try {
            let queryParams: any = {};

            if (orderBy) {
                queryParams['order_by'] = orderBy;
            }
            if (orderType) {
                queryParams['order_type'] = orderType;
            }

            let url = prepareURLEncodedParams(`${process.env.NEXT_PUBLIC_API_URL}/farm/${id}/crops/list`,queryParams);

            let response = await fetch(url, { method: "GET" });
            let responseData: any = await response.json();

            if (responseData.success == true) {
                setCropOptions(responseData?.data);
            } else {
                setCropOptions([]);
            }
        } catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }

    //create crop api call
    const createCrop = async (value: any) => {
        setLoadingForAdd(true)
        let options = {
            method: "POST",
            body: JSON.stringify(value),
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            })
        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${formId}/crops`, options)
            let responseData = await response.json()
            if (responseData.success) {
                await getCropsDetails(formId)
                setDilogOpen(false)
                setAlertMessage(responseData.message)
                setAlertType(true)
            } else if (responseData?.status == 422) {
                setErrorMessages(responseData?.errors);
            }
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setLoadingForAdd(false)

        }
    }

   
    useEffect(() => {
        if (router.isReady && router.query.farm_id && accessToken) {
            getFarmDetails(router.query.farm_id)
            dispatch(removeTheFilesFromStore([]));
        }
    }, [accessToken, router.isReady]);

    const captureFarmName = (selectedObject: any) => {
        if (selectedObject && Object.keys(selectedObject).length) {
            setFormId(selectedObject?._id);
            getCropsDetails(selectedObject?._id)
            router.replace(`/farms/${selectedObject?._id}/crops`)
        }
    }

    //create new folder (dilog)
    const captureResponseDilog = (value: any) => {
        if (!value) {
            setDilogOpen(false)
            setErrorMessages([]);
        }
        else {
            const { title, crop_area } = value;
            
            let obj = {
                title: title ? title?.trim() : "",
                crop_area: (crop_area&&+crop_area) ? crop_area : null
            }
            setErrorMessages([]);
            createCrop(obj)
        }
    }


    const toggleDrawer = (open: boolean) => {
        setState({ ...state, 'bottom': open });
    };

    const sortMethod = (value: number) => {

        if (sortBy == 'createdAt') {
            if (value == 1 && sortType == 'desc') {
                return true;
            } else if(value == 2 && sortType == 'asc'){
                return true
            }
        } else if (sortBy == 'title') {
            if (value == 3 && sortType == 'desc') {
                return true;
            } else if(value == 4 && sortType == 'asc'){
                return true
            }
        } else if (sortBy == 'crop_area') {
             if (value == 5 && sortType == 'desc') {
                return true;
            } else if(value == 6 && sortType == 'asc'){
                return true
            }
        }

        return false;
    }

    const sortByMethod = (sortBy: string, sortType: string) => {
        toggleDrawer(false);
        getCropsDetails(router.query.farm_id as string, sortBy, sortType);
        setSortBy(sortBy);
        setSortType(sortType)
    }

    const SortMenu = () => {
        return (
            <div>
                <ListItem> <SortIcon /><b>Sort By</b></ListItem>

                <ListItem onClick={()=>sortByMethod('createdAt','desc')}><div style={{ minHeight:"1rem", minWidth:"1rem",maxHeight:"1rem", maxWidth:"1rem"}}><DoneIcon sx={{ display: sortMethod(1) ? "flex" : "none", fontSize:"1rem" }} /></div>{'Recent First'}</ListItem>
                <ListItem onClick={()=>sortByMethod('createdAt','asc')} sx={{ borderBottom: "1px solid #B4C1D6" }}><div style={{ minHeight:"1rem", minWidth:"1rem",maxHeight:"1rem", maxWidth:"1rem"}}><DoneIcon sx={{ display: sortMethod(2) ? "flex" : "none", fontSize:"1rem" }} /></div>{'Oldest First'}</ListItem>
                <ListItem onClick={()=>sortByMethod('title','asc')}><div style={{ minHeight:"1rem", minWidth:"1rem",maxHeight:"1rem", maxWidth:"1rem"}}><DoneIcon sx={{ display: sortMethod(3) ? "flex" : "none", fontSize:"1rem" }} /></div>{'Title (A-Z)'}</ListItem>
                <ListItem onClick={()=>sortByMethod('title','desc')} sx={{ borderBottom: "1px solid #B4C1D6" }}><div style={{ minHeight:"1rem", minWidth:"1rem",maxHeight:"1rem", maxWidth:"1rem"}}><DoneIcon sx={{ display: sortMethod(4) ? "flex" : "none", fontSize:"1rem" }} /></div>{'Title (Z-A)'}</ListItem>
                <ListItem onClick={()=>sortByMethod('crop_area','desc')}><div style={{ minHeight:"1rem", minWidth:"1rem",maxHeight:"1rem", maxWidth:"1rem"}}><DoneIcon sx={{ display: sortMethod(5) ? "flex" : "none", fontSize:"1rem" }} /></div>{'Area Highest first'}</ListItem>
                <ListItem onClick={()=>sortByMethod('crop_area','asc')}><div style={{ minHeight:"1rem", minWidth:"1rem",maxHeight:"1rem", maxWidth:"1rem"}}><DoneIcon sx={{ display: sortMethod(6) ? "flex" : "none", fontSize:"1rem" }} /></div>{'Area Lowest first'}</ListItem>
                
           </div>
        )
    }

    return (
        <div className={styles.myCropsPage}>
            <FormControl
                sx={{ width: "100%" }}
                variant="outlined"
            >
                <InputLabel color="primary" />
                <SelectAutoCompleteForFarms options={formOptions} label={"title"} onSelectValueFromDropDown={captureFarmName} placeholder={"Select Farm"} defaultValue={defaultValue} />
                <FormHelperText />
            </FormControl>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                <IconButton onClick={() => toggleDrawer(true)} >
                    <SortIcon /><Typography variant="caption">Sort By</Typography>
                </IconButton>
                <React.Fragment>
                    <Drawer
                        onClose={()=>toggleDrawer(false)}
                        anchor={'bottom'}
                        open={state['bottom']}
                        sx={{
                            '& .MuiBox-root': {
                                height: "35vh"
                            }
                        }}
                    >
                         <Box>
                            <SortMenu/>
                        </Box>
                    </Drawer>
                </React.Fragment>
                <IconButton onClick={() => setDilogOpen(true)}>
                    <AddIcon /><Typography variant="caption">New Folder</Typography>
                </IconButton>
            </div>

            <div className={styles.allCrops}>
                {cropOptions?.length ?
                    <div id={styles.allCropCardBlock}>
                        {cropOptions?.map((item: any, index: any) => (
                            <CropCard itemDetails={item} key={index} getCropsDetails={getCropsDetails} />

                        ))}
                    </div>
                    : (!loading ?
                        <div id={styles.noData} style={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "3rem" }}>
                            <Typography variant="h4">No Crops</Typography>
                        </div>
                        : "")}
            </div>

            {cropOptions?.length && !loading ? <div className="addFormPositionIcon" >
                <img src="/add-plus-icon.svg" alt="" onClick={() => router.push(`/farms/${formId}/crops/add-item`)} />
            </div> : ""}

            {dilogOpen ? <NewFolderDiloag
                open={dilogOpen}
                captureResponseDilog={captureResponseDilog}
                loading={loadingForAdd}
                errorMessages={errorMessages}
            /> : ""}
            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} mobile={true} />
            <LoadingComponent loading={loading} />
        </div>
    )
}
export default AllCropsComponent;