import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Chip, IconButton, Typography } from "@mui/material"; 
import ImageComponent from "../Core/ImageComponent";
import AddIcon from '@mui/icons-material/Add';
import timePipe from "@/pipes/timePipe";
import FarmTable from "./FarmTable";
import SearchComponent from "../Core/SearchComponent";
import LoadingComponent from "../Core/LoadingComponent";
import DeleteDialogCompoennt from "../Core/DeleteDialogComponent";
import TablePaginationComponent from "../Core/TablePaginationComponent";
import { categoriesType } from "@/types/supportTypes";
import { CategoriesType } from "@/types/categoryTypes";
import { GetLogsByFarmIdPropsType, PaginationDetailsType } from "@/types/farmCardTypes";
import { ResourcesTypeInResponse, ResourcesTypeInResponseWithLogo } from "@/types/logsTypes";
import { prepareURLEncodedParams } from "../../../lib/requestUtils/urlEncoder";
import getAllCategoriesService from "../../../lib/services/Categories/getAllCategoriesService";
import getLogsByFarmIdService from "../../../lib/services/LogsService/getLogsByFarmIdService";
import deleteALogService from "../../../lib/services/LogsService/deleteALogsService";
import styles from "./FarmTableLogs.module.css";


const FarmTableLogs = () => {

    const router: any = useRouter();
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [paginationDetails, setPaginationDetails] = useState<PaginationDetailsType | null>();
    const [page, setPage] = useState<number | string>(1);
    const [limit, setLimit] = useState<number | string>(10);
    const [sortCount, setSortCount] = useState(0);
    const [sortSortKeyValue, setSortKeyValue] = useState<string>();


    const [searchString, setSearchString] = useState<string>(router.query.search_string ? router.query.search_string : "");
    const [orderBy, setOrderBy] = useState(router.query.order_by ? router.query.order_by : "")
    const [orderType, setOrderType] = useState<string>(router.query.order_type ? router.query.order_type : "");

    const [categoriesList, setCategoriesList] = useState<Array<CategoriesType>>([]);


    const getAllCategories = async () => {
        const response = await getAllCategoriesService();
        if (response?.success) {
            setCategoriesList(response?.data);

        }

    }

    useEffect(() => {
        if (router.isReady && accessToken && router.query.farm_id) {
            getAllCategories();
            getFarmLogs({ farmId: router.query.farm_id, page: router.query.page, limit: router.query.limit, search: router.query.search_string, orderBy: router.query?.order_by, orderType: router.query?.order_type });

            setLimit(router.query?.limit);
            setPage(router.query?.page);
            setSearchString(router.query?.search_string);
            setOrderBy(router.query?.order_by);
            setOrderType(router.query?.order_type);
        }
    }, [router.query.farm_id, accessToken]);


    const getFarmLogs = async ({ farmId = router.query.farm_id, page = 1, limit = 10, search = searchString, orderBy, orderType }: Partial<GetLogsByFarmIdPropsType>) => {
        setLoading(true);
        try {
            let queryParams: any = {};
            if (search) {
                queryParams['search_string'] = search;
            }
            if (orderBy) {
                queryParams['order_by'] = orderBy;
            }
            if (orderType) {
                queryParams['order_type'] = orderType;
            }
            if (page) {
                queryParams['page'] = page;
            }
            if (limit) {
                queryParams['limit'] = limit;
            }

            const { page: pageCount, limit: limitCount, ...restParams } = queryParams;

            router.push({ asPath: "/farm/[farm_id]/logs", pathname: `/farm/${router.query.farm_id}/logs`, query: queryParams });
            let paramString = prepareURLEncodedParams('', restParams);



            const response = await getLogsByFarmIdService({ farmId: farmId, page: page, limit: limit, paramString: paramString });
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteContent, setDeleteContent] = useState<any>({});

    const deleteLog = async (item: any) => {
        setDeleteDialogOpen(true);
        setDeleteContent(item);
    }

    const confirmDelete = async (check: boolean, id: string) => {
        if (check) {
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
                setDeleteDialogOpen(false);
            }
        } else {
            setDeleteDialogOpen(false);
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
        getFarmLogs({ page: value, limit: limit, orderBy: orderBy, orderType: orderType });
    }

    const captureRowPerItems = (value: number) => {
        setPage(1);
        setLimit(value);
        getFarmLogs({ page: 1, limit: value, orderBy: orderBy, orderType: orderType });
    }
    useEffect(() => {
        const delay = 500;
        const debounce = setTimeout(() => {
            if (searchString) {
                getFarmLogs({ page: 1, limit: router.query.limit, search: searchString, orderBy: router.query?.order_by, orderType: router.query?.order_type });
            } else {
                getFarmLogs({ page: router.query.page, limit: router.query.limit, search: searchString, orderBy: router.query?.order_by, orderType: router.query?.order_type });
            }
        }, delay);
        return () => clearTimeout(debounce);
    }, [searchString]);

    const searchStringChange = (value: string) => {
        setPage(1);
        setSearchString(value);
        // getFarmLogs({ page: 1, limit: router.query.limit, search: value, orderBy: router.query?.order_by, orderType: router.query?.order_type });
    }
    const workTypeOptions = [
        { title: 'All', value: "all", color: "#3462CF" },
        { title: 'Manual', value: "manual", color: "#5E9765" },
        { title: 'Machinery', value: "machinery", color: "#D94841" },
    ];

    const categoriesColors: Array<string> = [
        "#E57373",
        "#66BB6A",
        "#64B5F6",
        "#FFD54F",
        "#AB47BC",
        "#AED581",
        "#9575CD",
        "#FF8A65",
        "#FFD700",
        "#FF80AB",
        "#26A69A",
        "#4CAF50",
        "#42A5F5",
        "#FFB74D",
        "#FF5722",
        "#78909C",
    ];

    const getLabel = (item: string) => {
        return (categoriesList.find((categoryItem: Partial<CategoriesType>) => categoryItem.slug == item))?.category
    }

    const getTitleOrColor = (item: string, value: string) => {

        let objValue: any = (workTypeOptions.find((categoryItem: Partial<categoriesType>) => categoryItem.value?.toLowerCase() == item.toLowerCase()))
        if(objValue)
        return objValue[value];
    else  return "#78909C"

    }

    const setBackColor = (item: any) => {
        let index = categoriesList.findIndex((categoryItem: CategoriesType, index: number) => item == categoryItem.slug);
        if (categoriesColors[index])
            return categoriesColors[index];
        return '#a4a6a9'

    }

    const appliedSort = async (sortKey: string) => {

        if (sortKey) {

            let sortTempValueCount = sortCount;


            let sortByField = '';
            let orderTypeField = '';

            if (sortKey == 'date') {
                sortByField = 'createdAt';
            } if (sortKey == 'workType') {
                sortByField = 'work_type';
            } if (sortKey == 'manualHours') {
                sortByField = 'total_manual_hours'
            } if (sortKey == 'machineHours') {
                sortByField = 'total_machinary_hours'
            }


            if (sortKey != sortSortKeyValue) {
                setSortKeyValue(sortKey);
                sortTempValueCount = 0
            } else {
                sortTempValueCount = sortTempValueCount + 1;
            }
            if (sortTempValueCount > 2) {
                sortTempValueCount = 0;
            }

            if (sortTempValueCount == 0) {
                orderTypeField = 'asc';
            } else if (sortTempValueCount == 1) {
                orderTypeField = 'desc';
            } else {
                orderTypeField = '';
                sortByField = '';
            }

            setSortCount(sortTempValueCount)

            setOrderBy(sortByField);
            setOrderType(orderTypeField)
            getFarmLogs({ farmId: router.query.farm_id, page: 1, limit: router.query.limit, orderBy: sortByField, orderType: orderTypeField });

        }
    }

    const columns = [
        {
            columnId: "date",
            isSorted: true,
            Header: "Date",
            width : "70px",
            accessor: (row: any) => {
                return (
                    <div style={{ color: "var(--body)" }}>
                        {timePipe(row.createdAt, 'DD, MMM YY')}
                    </div>
                    )
            }
        },
        {
            Header: "Title",
            accessor: 'title',
            minWidth: "200px",
            maxWidth: "300px",
        },
        {
            columnId: "category",
            Header: "Category",
            minWidth: "200px",
            maxWidth: "300px",
            accessor: (row: any) => {
                return (
                    row.categories.length && row.categories.map((item: string, index: number) => {
                        return (
                            <Chip label={getLabel(item)} key={index} sx={{ margin: "2px", height: "auto", padding: "4px 0", backgroundColor: setBackColor(item), color: 'white', fontSize: "13px" }} />
                        )
                    })
                )
            }
        },
        {
            columnId: "workType",
            isSorted: true,
            Header: "Work Type",
            width: "100px",
            accessor: (row: any) => {
                return (
                    <p style={{ color: getTitleOrColor(row.work_type, 'color'), fontSize: "15px" }}>{getTitleOrColor(row.work_type, 'title')}</p>
                )
            }
        },
        // {
        //     Header: "Work Type",
        //     accessor: "work_type",
        // },
        {
            Header: "Resources",
            minWidth: "60px",
            maxWidth: "130px",
            accessor: (row: any) => {
                const updatedRowModules: any = stayUpdatedResources(row.resources);
                return (
                    <div style={{ display: "flex", gap: "2px" }}>
                        {updatedRowModules && updatedRowModules.length && updatedRowModules.map((item: any, index: number) => {
                            return (
                                <div key={index} style={{ background: "var(--white)", border: "1px solid var(--stroke)", borderRadius: "4px", display: "flex", alignItems: "center", gap: "4px", padding: "2px 4px" }} >
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
            columnId: "manualHours",
            isSorted: true,
            Header: "Manual Hrs",
            minWidth: "60px",
            maxWidth: "80px",
            accessor: (row: any) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                       <img src="/timehalfpast-green.svg" alt="view" width="18" />
                        <span style={{ color: "var(--body)" }}>{row.total_manual_hours + ' Hrs'}</span>
                    </div>
                       )
            }
        },
        {
            columnId: "machineHours",
            isSorted: true,
            Header: "Machine Hrs",
            minWidth: "60px",
            maxWidth: "80px",
            accessor: (row: any) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                       <img src="/timehalfpast-blue.svg" alt="view" width="18" />
                        <span style={{ color: "var(--body)" }}>{row.total_machinary_hours + ' Hrs'}</span>
                    </div>
                       )
            }
        },
        {
            Header: "Actions",
            minWidth: "120px",
            accessor: (row: any) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                        <IconButton onClick={() => router.push(`/farm/${router.query.farm_id}/logs/${row._id}`)}>
                            <img src="/view-icon.svg" alt="view" width="18" />
                        </IconButton>
                        <IconButton onClick={() => router.push(`/farm/${router.query.farm_id}/logs/${row._id}/edit`)}>
                            <img src="/pencil-icon.svg" alt="view" width="18" />
                        </IconButton>
                        <IconButton onClick={() => deleteLog(row)}>
                            <img src="/trast-icon.svg" alt="view" width="18" />
                        </IconButton>
                    </div>
                )
            }
        },
    ];


    return (
        <div className="logsDashboardTable">
            <div className={styles.titleFilters}>
                <Typography variant="h3" className={styles.title}>Farm Dashboard</Typography>
                <SearchComponent onChange={searchStringChange} size="small" value={searchString} searchString={searchString} placeholder={'Search By Title'} />
                <Button color="success" fullWidth variant="contained" size="medium" onClick={() => router.push(`/farm/${router.query.farm_id}/logs/add`)} startIcon={<AddIcon />}>
                    Add Log
                </Button>
            </div>
            <FarmTable columns={columns} data={data} loading={loading} appliedSort={appliedSort} />
            <TablePaginationComponent paginationDetails={paginationDetails} capturePageNum={capturePageNum} captureRowPerItems={captureRowPerItems} values='Logs' />
            <LoadingComponent loading={loading} />
            <DeleteDialogCompoennt deleteContent={deleteContent} deleteDialogOpen={deleteDialogOpen} confirmDelete={confirmDelete} />
        </div>
    )
}

export default FarmTableLogs;