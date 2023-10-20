import { removeTheFilesFromStore, setFarmTitleTemp } from "@/Redux/Modules/Farms";
import NewFolderDiloag from "@/components/Core/AddCropalert/AddNewFolder";
import AlertComponent from "@/components/Core/AlertComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import SelectAutoCompleteForFarms from "@/components/Core/selectDropDownForFarms";
import AddIcon from '@mui/icons-material/Add';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SortIcon from '@mui/icons-material/Sort';
import { Box, Divider, Drawer, FormControl, FormHelperText, IconButton, InputLabel, ListItem, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import CropCard from "./CropCard";
import styles from "./crop-card.module.css";
import ListAllFarmForDropDownService from "../../../../lib/services/FarmsService/ListAllFarmForDropDownService";

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

        try {
            let response = await ListAllFarmForDropDownService("", accessToken);
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
    const getCropsDetails = async (id: string, orderBy = sortBy, orderType = sortType) => {
        setLoading(true);

        try {
            let queryParams: any = {};

            if (orderBy) {
                queryParams['order_by'] = orderBy;
            }
            if (orderType) {
                queryParams['order_type'] = orderType;
            }

            let url = prepareURLEncodedParams(`${process.env.NEXT_PUBLIC_API_URL}/farm/${id}/crops/list`, queryParams);

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
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${formId ? formId : router.query.farm_id}/crops`, options)
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
        } else {
            setLoading(false);
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
                crop_area: crop_area,
            };

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
            } else if (value == 2 && sortType == 'asc') {
                return true
            }
        } else if (sortBy == 'title') {
            if (value == 3 && sortType == 'asc') {
                return true;
            } else if (value == 4 && sortType == 'desc') {
                return true
            }
        } else if (sortBy == 'crop_area') {
            if (value == 5 && sortType == 'desc') {
                return true;
            } else if (value == 6 && sortType == 'asc') {
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
            <div className={styles.sortOptions}>
                <ListItem className={styles.subTitle}> <SortIcon /> <span>Sort By</span></ListItem>
                <ListItem onClick={() => sortByMethod('createdAt', 'desc')}>
                    <RadioButtonUncheckedIcon sx={{ display: sortMethod(1) ? "none" : "flex", fontSize: "1.25rem" }} />
                    <RadioButtonCheckedIcon sx={{ display: sortMethod(1) ? "flex" : "none", color: "#05a155", fontSize: "1.25rem" }} />
                    <div style={{ color: sortMethod(1) ? "#05a155" : "#333333", }}>{'Recent First'}</div>
                </ListItem>
                <ListItem onClick={() => sortByMethod('createdAt', 'asc')}>
                    <RadioButtonUncheckedIcon sx={{ display: sortMethod(2) ? "none" : "flex", fontSize: "1.25rem" }} />
                    <RadioButtonCheckedIcon sx={{ display: sortMethod(2) ? "flex" : "none", color: "#05a155", fontSize: "1.25rem" }} />
                    <div style={{ color: sortMethod(2) ? "#05a155" : "#333333", }}>{'Oldest First'}</div>
                </ListItem>
                <Divider variant="middle" className={styles.divider} component="li" />
                <ListItem onClick={() => sortByMethod('title', 'asc')}>
                    <RadioButtonUncheckedIcon sx={{ display: sortMethod(3) ? "none" : "flex", fontSize: "1.25rem" }} />
                    <RadioButtonCheckedIcon sx={{ display: sortMethod(3) ? "flex" : "none", color: "#05a155", fontSize: "1.25rem" }} />
                    <div style={{ color: sortMethod(3) ? "#05a155" : "#333333", }}>{'Title (A-Z)'}</div>
                </ListItem>
                <ListItem onClick={() => sortByMethod('title', 'desc')}>
                    <RadioButtonUncheckedIcon sx={{ display: sortMethod(4) ? "none" : "flex", fontSize: "1.25rem" }} />
                    <RadioButtonCheckedIcon sx={{ display: sortMethod(4) ? "flex" : "none", color: "#05a155", fontSize: "1.25rem" }} />
                    <div style={{ color: sortMethod(4) ? "#05a155" : "#333333", }}>{'Title (Z-A)'}</div>
                </ListItem>
                <Divider variant="middle" className={styles.divider} component="li" />
                <ListItem onClick={() => sortByMethod('crop_area', 'desc')}>
                    <RadioButtonUncheckedIcon sx={{ display: sortMethod(5) ? "none" : "flex", fontSize: "1.25rem" }} />
                    <RadioButtonCheckedIcon sx={{ display: sortMethod(5) ? "flex" : "none", color: "#05a155", fontSize: "1.25rem" }} />
                    <div style={{ color: sortMethod(5) ? "#05a155" : "#333333", }}>{'Area Highest first'}</div>
                </ListItem>
                <ListItem onClick={() => sortByMethod('crop_area', 'asc')}>
                    <RadioButtonUncheckedIcon sx={{ display: sortMethod(6) ? "none" : "flex", fontSize: "1.25rem" }} />
                    <RadioButtonCheckedIcon sx={{ display: sortMethod(6) ? "flex" : "none", color: "#05a155", fontSize: "1.25rem" }} />
                    <div style={{ color: sortMethod(6) ? "#05a155" : "#333333", }}>{'Area Lowest first'}</div>
                </ListItem>
            </div>
        )
    }

    let colorsArray = ["#C71585", "#7B68EE", "#FF8C00", " #008080", "#2E8B57", "#4682B4", "#000080", "#3D3D5B", " #CC0044", "#BA55D3"
        , "#663399", "#8B0000", "#FF4500", "#DA0E0E", "#00CED1", "#4169E1", " #A52A2A", "#2D1E2F", "#714E47", "#C65B7C"
        , "#A04662", "#FE654F", " #5F6A89", "#067BBD"]

    return (
        <div className={styles.myCropsPage}>
            <FormControl
                variant="outlined"
                className={styles.filterBox}
            // style={{border:"1px solid"}}
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
                        onClose={() => toggleDrawer(false)}
                        anchor={'bottom'}
                        open={state['bottom']}
                    >
                        <Box>
                            <SortMenu />
                        </Box>
                    </Drawer>
                </React.Fragment>
                {/* <IconButton onClick={() => setDilogOpen(true)}>
                    <AddIcon /><Typography variant="caption">New Crop</Typography>
                </IconButton> */}
            </div>

            <div className={styles.allCrops}>
                {cropOptions?.length ?
                    <div id={styles.allCropCardBlock}>
                        {cropOptions?.map((item: any, index: any) => {
                            const colorIndex = index % colorsArray.length;

                            return (
                                <CropCard itemDetails={item} key={index} getCropsDetails={getCropsDetails} colorIndex={colorIndex} />
                            )

                        })}
                    </div>
                    : (!loading ?
                        <div className={styles.noData}>
                            <Image src="/no-crops-image.svg" alt="" width={120} height={120} />
                            <Typography variant="h4">This farm has no crops</Typography>
                        </div>
                        : "")}
            </div>

            {!loading ? <div className="addFormPositionIcon" >
                <img src="/add-plus-icon.svg" alt="" onClick={() => setDilogOpen(true)} />
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