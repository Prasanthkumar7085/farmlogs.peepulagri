import timePipe from "@/pipes/timePipe";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FarmTable from "./FarmTable";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageComponent from "../Core/ImageComponent";
import getLogsByFarmIdService from "../../../lib/services/LogsService/getLogsByFarmIdService";
import TablePaginationComponent from "../Core/TablePaginationComponent";
import { GetLogsByFarmIdPropsType, PaginationDetailsType } from "@/types/farmCardTypes";
import SearchComponent from "../Core/SearchComponent";
import { Button } from "@mui/material";
import deleteALogService from "../../../lib/services/LogsService/deleteALogsService";
import LoadingComponent from "../Core/LoadingComponent";
import { ResourcesTypeInResponse, ResourcesTypeInResponseWithLogo } from "@/types/logsTypes";


const FarmTableLogs = () => {

    const router: any = useRouter();

    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState<PaginationDetailsType | null>();
    const [page, setPage] = useState<number | string>(1);
    const [limit, setLimit] = useState<number | string>(10);
    const [searchString, setSearchString] = useState<string>('');


    useEffect(() => {
        if (router.isReady) {
            getFarmLogs({ farmId: router.query.farm_id, page: router.query.page, limit: router.query.limit });
            getSingleFarm(router.query.farm_id);
        }
    }, [router]);


    const getSingleFarm = (id: string) => {

    }

    const getFarmLogs = async ({ farmId = router.query.farm_id, page = 1, limit = 10, search = searchString }: Partial<GetLogsByFarmIdPropsType>) => {
        setLoading(true);
        try {
            const response = await getLogsByFarmIdService({ farmId: farmId, page: page, limit: limit, search: search });
            if (response.success) {
                const { data, limit, page, total, total_pages } = response;
                setData(data);
                setPaginationDetails({ limit: limit, page: page, total: total, total_pages: total_pages });

            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    const deleteLog = async (id: string) => {

        setLoading(true);
        try {
            let response: any = await deleteALogService(id);
            if (response.success) {
                getFarmLogs({ farmId: router.query.farm_id, page: router.query.page, limit: router.query.limit });
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const checkForDuplicatesAndAdd = (updatedArray: Array<ResourcesTypeInResponse>, item: ResourcesTypeInResponse, logo: string) => {
        let arrayTest: any = [...updatedArray];
        let index = arrayTest.findIndex((arrayItem: ResourcesTypeInResponseWithLogo) => arrayItem.title.toLowerCase() == item.title.toLowerCase());
        if (index == -1) {
            arrayTest.push({ ...item, logo: logo });
        } else {
            arrayTest[index] = { ...arrayTest[index], quantity: arrayTest[index].quantity + item.quantity }
        }
        return arrayTest

    }
    const stayUpdatedResources = (rowDetails: Array<ResourcesTypeInResponse>) => {

        let updatedArray: Array<ResourcesTypeInResponseWithLogo> = [];
        if (rowDetails && rowDetails.length) {
            rowDetails.map((item: any) => {
                if (item.title.toLowerCase() == 'tractor') {
                    updatedArray = checkForDuplicatesAndAdd(updatedArray, item, '/tractor.svg')
                } else if (item.title.toLowerCase() == "sprayers") {
                    updatedArray = checkForDuplicatesAndAdd(updatedArray, item, '/sprayer.svg')
                } else if (item.title.toLowerCase() == 'men') {
                    updatedArray = checkForDuplicatesAndAdd(updatedArray, item, '/man.svg')
                } else if (item.title.toLowerCase() == 'women') {
                    updatedArray = checkForDuplicatesAndAdd(updatedArray, item, '/women.svg')
                } else {
                    updatedArray = checkForDuplicatesAndAdd(updatedArray, item, '/')
                }
            })

            return updatedArray.length ? updatedArray : null;
        }
    }

    const capturePageNum = (value: number) => {
        setPage(value);
        getFarmLogs({ page: value });
    }

    const captureRowPerItems = (value: number) => {
        setPage(1);
        setLimit(value);
        getFarmLogs({ page: 1, limit: value });
    }



    const searchStringChange = (value: string) => {
        setPage(1);
        setSearchString(value);
        getFarmLogs({ page: 1, search: value });
    }

    const categoryOptions = [
        { title: 'Soil Preparation', value: "soil_preparation", color: "#E57373" },
        { title: 'Planting', value: "plainting", color: "#66BB6A" },
        { title: 'Irrigation', value: "irrigation", color: "#64B5F6" },
        { title: 'Fertilization', value: "fertilization", color: "#FFD54F" },
        { title: 'Pest Management', value: "pest_management", color: "#AB47BC" },
        { title: 'Weeding', value: "weeding", color: "#AED581" },
        { title: 'Crop Rotation', value: "crop_rotation", color: "#9575CD" },
        { title: 'Harvesting', value: "harvesting", color: "#FF8A65" },

        { title: 'Livestock Care', value: "livestock_care", color: "#FFD700" },
        { title: 'Breeding & Reproduction', value: "breeding_reproduction", color: "#FF80AB" },
        { title: 'Equipment Management', value: "equipment_management", color: "#78909C" },
        { title: 'Market & Scale Management', value: "market_scale_management", color: "#26A69A" },
        { title: 'Environmental Stewardship', value: "enviranmental_stewardship", color: "#4CAF50" },
        { title: 'Weather Monitoring', value: "weather_monitoring", color: "#42A5F5" },
        { title: 'Financial Management', value: "financial_management", color: "#FFB74D" },
        { title: 'Research and Learning', value: "research_and_learning", color: "#FF5722" },

    ];
    const getLabel = (item: string) => {
        return (categoryOptions.find((categoryItem: { title: string, value: string }) => categoryItem.value == item))?.title
    }

    const setBackColor = (item: any) => {
        return (categoryOptions.find((categoryItem: { title: string, value: string }) => categoryItem.value == item))?.color
    }

    const columns = [
        {
            Header: "Date",
            accessor: (row: any) => timePipe(row.createdAt, 'DD, MMM YYYY')
        },
        {
            Header: "Title",
            accessor: 'title'
        },
        {
            Header: "Category",
            accessor: (row: any) => {
                return (
                    row.categories.length && row.categories.map((item: string, index: number) => {
                        return (
                            <Chip label={getLabel(item)} key={index} sx={{ margin: "2px", backgroundColor: setBackColor(item), color: 'white' }} />
                        )
                    })
                )
            }
        },
        {
            Header: "Work Type",
            accessor: "work_type",
        },


        {
            Header: "Resources",
            accessor: (row: any) => {
                const updatedRowModules: any = stayUpdatedResources(row.resources);
                return (
                    <div style={{ display: "flex", gap: "2px" }}>
                        {updatedRowModules && updatedRowModules.length && updatedRowModules.map((item: any, index: number) => {
                            return (
                                <div key={index} style={{ border: ".1px solid #c1c1c1", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px" }} >
                                    <ImageComponent src={item.logo} width={15} height={15} alt={item.logo + '1'} />
                                    {item.quantity}
                                </div>
                            )
                        })}
                    </div>
                )
            },
        },


        {
            Header: "Manual Hours",
            accessor: (row: any) => { return row.total_manual_hours + ' Hours' }
        },
        {
            Header: "Machine Hours",
            accessor: (row: any) => { return row.total_machinary_hours + ' Hours' }
        },
        {
            Header: "Actions",
            accessor: (row: any) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                        <IconButton onClick={() => router.push(`/farm/${router.query.farm_id}/logs/${row._id}`)}>
                            <VisibilityIcon color='info' />
                        </IconButton>
                        <IconButton onClick={() => router.push(`/farm/${router.query.farm_id}/logs/${row._id}/edit`)}>
                            <EditIcon color='warning' />
                        </IconButton>
                        <IconButton onClick={() => deleteLog(row._id)}>
                            <DeleteIcon color='error' />
                        </IconButton>
                    </div>
                )
            }
        },
    ];


    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "40px", paddingRight: "20px" }}>
                <SearchComponent onChange={searchStringChange} value={searchString} searchString={searchString} placeholder={'Search By Title'} />
                {/* <Link href="/farm/[farm_id]/logs/add" as={`/farm/${router.query.farm_id}/logs/add`} style={{ textDecoration: "none", color: "#000000" }}> */}
                <Button onClick={() => router.push(`/farm/${router.query.farm_id}/logs/add`)}>
                    Add Log
                </Button>
                {/* </Link> */}
            </div>
            <FarmTable columns={columns} data={data} loading={loading} />
            <TablePaginationComponent paginationDetails={paginationDetails} capturePageNum={capturePageNum} captureRowPerItems={captureRowPerItems} values='Logs' />
            <LoadingComponent loading={loading} />
        </div>
    )
}

export default FarmTableLogs;