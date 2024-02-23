import React, { useEffect, useState } from 'react';
import styles from "./gloabalSearch.module.css";
import { Autocomplete, Button, ClickAwayListener, Dialog, DialogContent, IconButton, TextField } from '@mui/material';
import Image from 'next/image';
import getAllLocationsService from '../../../../lib/services/Locations/getAllLocationsService';
import { useDispatch, useSelector } from 'react-redux';
import ListAllFarmForDropDownService from '../../../../lib/services/FarmsService/ListAllFarmForDropDownService';
import removeCookie from '../../../../lib/CookieHandler/removeCookie';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { removeUserDetails } from '@/Redux/Modules/Auth';
import { deleteAllMessages } from '@/Redux/Modules/Conversations';
import FarmAutoCompleteInAllScouting from '@/components/ScoutingWeb/ListScoutsComponents/FarmAutoCompleteInAllScouting';
import { prepareURLEncodedParams } from '../../../../lib/requestUtils/urlEncoder';

const GlobalSearch = ({ globalSearchOpen, setGlobalSearchOpen }: any) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );
    const [, , removeCookie] = useCookies(["userType_v2"]);
    const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);
    const [mounted, setMounted] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [locations, setLocations] = useState<
        Array<{ title: string; _id: string }>
    >([]);
    const [location, setLocation] = useState<any>();
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [settingLocationLoading, setSettingLocationLoading] = useState(false);
    const [changed, setChanged] = useState(false);
    const [farmOptions, setFarmOptions] = useState([]);
    const [farm, setFarm] = useState<any>();
    const [defaultValueSet, setDefaultValueSet] = useState<any>();
    const [autoCompleteLoading, setAutoCompleteLoading] = useState(false);

    useEffect(() => {
        setAutoCompleteLoading(true);
        setTimeout(() => {
            setAutoCompleteLoading(false);
        }, 1);
    }, []);

    const getLocations = async (newLocation = "") => {
        try {
            const response = await getAllLocationsService(accessToken);
            if (response?.success) {
                setLocations(response?.data);
                if (newLocation) {
                    setSettingLocationLoading(true);
                    const newLocationObject = response?.data?.find(
                        (item: any) => item?._id == newLocation
                    );

                    setLocation(newLocationObject);
                    setTimeout(() => {
                        setSettingLocationLoading(false);
                    }, 1);
                } else {
                    setSettingLocationLoading(true);

                    // setLocation({ title: 'All', _id: '1' });
                    setTimeout(() => {
                        setSettingLocationLoading(false);
                    }, 1);
                }
            }
            if (response?.data?.length) {
                setLocations([{ title: "All", _id: "1" }, ...response?.data]);
            } else {
                setLocations([{ title: "All", _id: "1" }]);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onChangeLocation = (e: any, value: any, reason: any) => {

        if (value) {
            setChanged(true);
            setLocation(value);
            setFarm(null);
            setDefaultValueSet(null)
            getAllFarms({
                farmId: '',
                searchString: '',
                location_id: value?._id as string
            });


        }
        else {
            setFarm(null);
            setDefaultValueSet(null)
            setChanged(true);
            setLocation(null);
            getAllFarms({
                farmId: '',
                searchString: '',
                location_id: ""
            });

        }
    };

    const getAllFarms = async ({
        farmId = "",
        searchString = "",
        location_id = "",
        searchStringChangeOrNot = false,
        clearOrNot = false,
    }: Partial<{
        farmId: string;
        searchString: string;
        location_id: string;
        searchStringChangeOrNot: boolean;
        clearOrNot: boolean;
    }>) => {

        setOptionsLoading(true);

        try {
            const response = await ListAllFarmForDropDownService(
                searchString,
                accessToken,
                location_id,
            );
            if (response?.success) {
                setFarmOptions(response?.data);



                if (farmId) {

                    let obj =
                        response?.data?.length &&
                        response?.data?.find((item: any) => item._id == farmId);
                    setFarm(obj);

                    getLocations(obj?.location_id?._id)
                }
            } else if (response?.statusCode == 403) {
                await logout();
            }
        } catch (err) {
            console.error(err);
        }
        finally {
            setOptionsLoading(false);
        }
    };

    const onSelectFarmFromDropDown = async (value: any, reason: string) => {

        if (reason == "clear") {

            let routerData = { ...router.query };
            delete routerData?.farm_id;
            delete routerData?.crop_id;
            delete routerData?.farm_search_string;
            delete routerData?.location_id;
            router.push({ query: routerData });
            setFarm(null);

            getAllFarms({ clearOrNot: true, location_id: router.query.location_id as string });


            return;
        }
        if (value) {
            setFarm(value);
            setSettingLocationLoading(true);
            setLocation(value?.location_id)
            setTimeout(() => {
                setSettingLocationLoading(false);
            }, 1);

        } else {
            setFarm(null);
        }
    };
    const logout = async () => {
        try {
            removeCookie("userType_v2");
            loggedIn_v2("loggedIn_v2");
            router.push("/");
            await dispatch(removeUserDetails());
            await dispatch(deleteAllMessages());
        } catch (err: any) {
            console.error(err);
        }
    };

    useEffect(() => {
        let debounce = setTimeout(() => {
            if (mounted) {
                setFarm(null);
                getAllFarms({
                    // farmId: router.query.farm_id as string,
                    searchString: searchString,
                    searchStringChangeOrNot: true,

                });
            }
        }, 500);
        return () => clearInterval(debounce);
    }, [searchString]);


    useEffect(() => {
        if (router.isReady && accessToken && !mounted) {
            setMounted(true);
            getAllFarms({
                farmId: router.query.farm_id as string,
                searchString: router.query.farm_search_string as string,
                location_id: router.query.location_id as string
            });
            getLocations(router.query.location_id as string);

        }
    }, [router.isReady, accessToken]);

    return (
        <Dialog open={globalSearchOpen} fullScreen sx={{
            background: "#0000008f", "& .MuiPaper-root": {
                margin: "0 !important",
                width: "100%",
                background: "#ffffff00",
                boxShadow: "none !important",

            },
        }}>
            <div className={styles.mainDiv}>

                <IconButton
                    className={styles.icon}
                    onClick={() => {
                        setGlobalSearchOpen(false)
                    }}>
                    <Image src={"/caret-left 2.svg"}
                        width={15}
                        height={15}
                        alt=""
                    />
                </IconButton>
                <Autocomplete
                    sx={{
                        width: "40%",

                        borderRadius: "4px", '& .MuiSvgIcon-root': {
                            color: "#fff"
                        }

                    }}
                    id="size-small-outlined-multi"
                    size="small"
                    fullWidth
                    noOptionsText={"No such location"}
                    value={location}
                    isOptionEqualToValue={(option, value) =>
                        option.title === value.title
                    }
                    getOptionLabel={(option: { title: string; _id: string }) =>
                        option.title
                    }
                    options={locations}
                    onChange={onChangeLocation}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search by location"
                            variant="outlined"
                            size="small"

                            sx={{
                                "& .MuiInputBase-root": {
                                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                                    backgroundColor: "#ABABAB",
                                    border: "none",
                                    color: "#fff",
                                    paddingBlock: "2.5px !important"
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: "0 !important", borderRadius: "4px !important"
                                }
                            }}
                        />
                    )}
                />
                <ClickAwayListener onClickAway={() => setSearchString("")}>

                    <Autocomplete
                        sx={{
                            width: "40%",

                            borderRadius: "4px", '& .MuiSvgIcon-root': {
                                color: "#fff"
                            }

                        }}
                        value={defaultValueSet}
                        id="size-small-outlined-multi"
                        size="small"
                        fullWidth
                        noOptionsText={"No such Farms"}
                        options={farmOptions && farmOptions?.length ? farmOptions : []}
                        loading={optionsLoading}
                        getOptionLabel={(option: any) =>
                            option["title"] ? option["title"]?.toUpperCase() : ""
                        }

                        // onClose={() => setSearchString("")}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option?._id}>
                                    {option?.title}
                                </li>
                            );
                        }}
                        onChange={(e: any, value: any, reason: any) => {
                            if (value) {
                                onSelectFarmFromDropDown(value, reason);
                                setDefaultValueSet(value);
                            } else {
                                onSelectFarmFromDropDown("", reason);
                                setDefaultValueSet(null);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder={"Search by farms"}
                                sx={{
                                    "& .MuiInputBase-root": {
                                        fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                                        backgroundColor: "#ABABAB",
                                        border: "none",
                                        color: "#fff",
                                        paddingBlock: "2.5px !important"
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: "0 !important", borderRadius: "4px !important"
                                    }
                                }} value={searchString}
                                onChange={(e) => {
                                    setSearchString(e.target.value);
                                }}
                            />
                        )}


                    />
                </ClickAwayListener>
                <Button variant='contained'
                    onClick={() => {
                        let queryParams: any = { "include": "tags" };


                        if (farm?._id) {
                            queryParams["farm_id"] = farm?._id;
                        }
                        if (farm?.title) {
                            queryParams["farm_search_string"] = farm?.title;
                        }
                        if (location?._id) {
                            queryParams["location_id"] = location?._id
                        }
                        let url = "/scouts"
                        url = prepareURLEncodedParams(url, queryParams);
                        router.push(url)
                        setGlobalSearchOpen(false)
                        setDefaultValueSet(null);
                        setLocation(null);
                        setFarm(null)

                    }}
                    className={styles.globalSearchButton}>
                    Search
                </Button>
            </div>
            {/* Other content of the dialog */}
        </Dialog>
    );
}

export default GlobalSearch;
