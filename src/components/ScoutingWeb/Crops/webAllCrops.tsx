import { Box, Card, IconButton, ListItem, Menu, MenuItem, Typography } from "@mui/material";
import styles from "../farms/FarmsNavBar.module.css";
import FolderStructure from "./FolderCard";
import CropsNavBarWeb from "./cropsHeader";
import AddIcon from '@mui/icons-material/Add';
import SortIcon from "@mui/icons-material/Sort"
import FarmDetailsMiniCard from "@/components/AddLogs/farm-details-mini-card";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import { CropTypeResponse } from "@/types/cropTypes";
import { prepareURLEncodedParams } from "../../../../lib/requestUtils/urlEncoder";
import getAllCropsService from "../../../../lib/services/CropServices/getAllCropsService";
import LoadingComponent from "@/components/Core/LoadingComponent";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { FarmDataType } from "@/types/farmCardTypes";
import { List } from "rsuite";
const AllCropsWebPage = () => {

    const router = useRouter();

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


    const [cropsData, setCropsData] = useState<Array<CropTypeResponse>>([]);
    const [farmsData, setFarmsData] = useState([]);
    const [farmSelected, setFarmSelected] = useState<FarmDataType | null>();

    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortType, setSortType] = useState('desc');

    const [anchorEl, setAnchorEl] = useState<any>();


    const getCropsByFarmId = async (farmId: string, orderBy: string, orderType: string) => {

        setLoading(true);
        let queryParamsUrl = '';
        let queryParams: any = {
            order_by: 'createdAt',
            order_type: 'desc'
        };

        if (orderBy) {
            queryParams['order_by'] = orderBy;
        }
        if (orderType) {
            queryParams['order_type'] = orderType;
        }
        if (Object.keys(queryParams).length) {
            queryParamsUrl = prepareURLEncodedParams('', queryParams);
            router.replace({ pathname: `/farm/${farmId}/crops`, query: queryParams });
        }
        const response = await getAllCropsService(farmId, queryParamsUrl);

        if (response.success) {
            setCropsData(response?.data);
        }
        setLoading(false);

    }


    const getAllFarms = async () => {
        setLoading(true);
        const response = await getAllFarmsService(accessToken);
        if (response.success) {
            setFarmsData(response?.data);
            let selectedFarm = response?.data.find((item: FarmDataType) => item._id == router.query.farm_id);
            setFarmSelected(selectedFarm);
            setSortBy(router.query.order_by as string);
            setSortType(router.query.order_type as string);
            await getCropsByFarmId(router.query.farm_id as string, router.query.order_by as string, router.query.order_type as string);
        }
        setLoading(false);
    }

    const captureFarmData = (selectedFarmData: FarmDataType | null) => {
        setFarmSelected(selectedFarmData);
        if (selectedFarmData) {
            router.replace(`/farm/${selectedFarmData?._id}/crops`);
            getCropsByFarmId(selectedFarmData?._id as string, sortBy, sortType);

        }
    }

    const sortByMethod = (sortBy: string, sortType: string) => {
        setAnchorEl(null);
        getCropsByFarmId(router.query.farm_id as string, sortBy, sortType);
        setSortBy(sortBy);
        setSortType(sortType)
    }

    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllFarms();
        }
    }, [router.isReady, accessToken]);



    const getColor = (orderBy: string, orderType: string) => {
        if (orderBy == sortBy && orderType == sortType) {
            return '#dedede';
        } return '#ffffff';
    }

    const MenuOptions = () => {
        return (
            <List>
                <ListItem sx={{ cursor: "pointer", background: getColor('createdAt', 'desc') }} onClick={() => sortByMethod('createdAt', 'desc')}>{'Recent First'}</ListItem>
                <ListItem sx={{ cursor: "pointer", background: getColor('createdAt', 'asc'), borderBottom: "1px solid #B4C1D6" }} onClick={() => sortByMethod('createdAt', 'asc')}>{'Oldest First'}</ListItem>
                <ListItem sx={{ cursor: "pointer", background: getColor('title', 'asc') }} onClick={() => sortByMethod('title', 'asc')}>{'Title (A-Z)'}</ListItem>
                <ListItem sx={{ cursor: "pointer", background: getColor('title', 'desc'), borderBottom: "1px solid #B4C1D6" }} onClick={() => sortByMethod('title', 'desc')}>{'Title (Z-A)'}</ListItem>
                <ListItem sx={{ cursor: "pointer", background: getColor('crop_area', 'desc') }} onClick={() => sortByMethod('crop_area', 'desc')}>{'Area Highest first'}</ListItem>
                <ListItem sx={{ cursor: "pointer", background: getColor('crop_area', 'asc') }} onClick={() => sortByMethod('crop_area', 'asc')}>{'Area Lowest first'}</ListItem>
            </List>
        )
    }

    return (
        <div className={styles.AllFarmsPageWeb}>
            <FarmDetailsMiniCard />
            <CropsNavBarWeb options={farmsData} captureFarmData={captureFarmData} farmSelected={farmSelected} />
            <div className={styles.filterBlock}>
                <div style={{display:"flex", alignItems:"center", cursor:"pointer"}} onClick={(event: any) => setAnchorEl(event.currentTarget)}>
                    <SortIcon /><Typography>Sort By</Typography>
                </div>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    sx={{
                        '& .MuiMenuItem-root': {
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            minHeight: "inherit",

                        }
                    }}
                >
                    <MenuOptions />
                </Menu>
                {/* <IconButton sx={{ padding: "0", borderRadius: "none" }}>
                    <AddIcon /><Typography >New Folder</Typography>
                </IconButton> */}
            </div>
            <div className={styles.allFarms} style={{ marginTop: "0 !important" }}>
                {cropsData.length ?
                    <FolderStructure cropsData={cropsData} loading={loading} />
                    : !loading ? <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <img src="/no-crops-image.svg" alt="No crops" width={400} height={250} />
                        <p style={{ margin: "0" }}>This farm has no crops</p>
                    </div> : ""}
            </div>

            <LoadingComponent loading={loading} />
        </div>
    );
}

export default AllCropsWebPage;