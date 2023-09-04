import ButtonComponent from "../Core/ButtonComponent";
import SearchComponent from "../Core/SearchComponent";
import AddIcon from '@mui/icons-material/Add';
import SupportDataTable from "./SupportDataTable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getAllSupportService from "../../../lib/services/SupportService/getAllSupportService";
import { SupportResponseDataType, SupportServiceTypes } from "@/types/supportTypes";
import TablePaginationComponent from "../Core/TablePaginationComponent";
import LoadingComponent from "../Core/LoadingComponent";
import deleteASupportService from "../../../lib/services/SupportService/deleteASupportService";
import AlertComponent from "../Core/AlertComponent";
import SelectComponent from "../Core/SelectComponent";
import updateSupportStatusService from "../../../lib/services/SupportService/updateSupportStatusService";
import styles from "./support.module.css";
import { useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../../../lib/requestUtils/urlEncoder";
import { quartersInYear } from "date-fns";


const SupportPage = () => {

    const router = useRouter();
    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

    const [searchString, setSearchString] = useState<string>('');
    const [page, setPage] = useState<string | number>(1);
    const [limit, setLimit] = useState<string | number>(10);
    const [status, setStatus] = useState<string | number>('')
    const [paginationDetails, setPaginationDetails] = useState();
    const [data, setData] = useState<Array<SupportResponseDataType> | null>();

    const [loading, setLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<boolean>(false);
    const [sortCount, setSortCount] = useState(0);
    const [sortSortKeyValue, setSortKeyValue] = useState<string>();

    const [orderBy, setOrderBy] = useState('')
    const [orderType, setOrderType] = useState('');

    const statusOptions = [
        { value: 'OPEN', title: 'Open' },
        { value: 'INPROGRESS', title: "Inprogress" },
        { value: 'RESOLVED', title: "Resolved" },
        { value: 'ARCHIVE', title: "Archive" }
    ];


    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllSupports({
                page: router.query.page as string,
                limit: router.query.limit as string,
                search: router.query.search_string as string,
                orderBy: router.query.order_by as string,
                orderType: router.query.order_type as string,
                status: router.query.status as string
            });


            setLimit(router.query?.limit as string);
            setPage(router.query?.page as string);
            setSearchString(router.query?.search_string as string);
            setOrderBy(router.query?.order_by as string);
            setOrderType(router.query?.order_type as string);
            setStatus(router.query?.status as string);
        }
    }, [accessToken]);


    const getAllSupports = async ({ page = 1, limit = 10, search = searchString, status, orderBy, orderType }: Partial<SupportServiceTypes>) => {
        setLoading(true);

        let queryParams: any = {};
        if (page)
            try {
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
                } if (status) {
                    queryParams['status'] = status;
                }
                console.log(queryParams);


                const { page: pageCount, limit: limitCount, ...restParams } = queryParams;

                router.push({ pathname: `/support`, query: queryParams });

                let paramString = prepareURLEncodedParams('', restParams);

                const response = await getAllSupportService({ page: page, limit: limit, accessToken: accessToken, paramString: paramString });
            if (response.success) {
                const { data, ...rest } = response;
                setPaginationDetails(rest);
                setData(data);
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const onStatusChange = (e: any) => {
        const value = e.target.value;
        setStatus(value);
        getAllSupports({ page: 1, limit: limit, orderBy: orderBy, orderType: orderType, search: searchString, status: value });
    }

    const onPageChange = (value: string | number) => {
        setPage(value);
        getAllSupports({ page: value, limit: limit, orderBy: orderBy, orderType: orderType, search: searchString, status: status });

    }
    const onLimitChange = (value: string | number) => {
        setPage(1);
        setLimit(value)
        getAllSupports({ page: 1, limit: value, orderBy: orderBy, orderType: orderType, search: searchString, status: status });

    }



    const deleteSupport = async (id: string) => {
        setLoading(true)
        try {
            let response = await deleteASupportService(id);

            if (response.success) {
                setAlertMessage(response.message);
                setAlertType(true);
                // { page: 1, limit: limit, orderBy: sortByField, orderType: orderTypeField, search: searchString, status: status }
                getAllSupports({ page: page, limit: limit, orderBy: orderBy, orderType: orderType, search: searchString, status: status });
            } else {
                setAlertMessage(response.message);
                setAlertType(false);
            }
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }

    }

    const appliedSort = (sortKey: string) => {
        console.log(sortKey);

        if (sortKey) {

            let sortTempValueCount = sortCount;

            let sortByField = '';
            let orderTypeField = '';

            if (sortKey == 'date') {
                sortByField = 'createdAt';
            } if (sortKey == 'query_name') {
                sortByField = 'title';
            } if (sortKey == 'description') {
                sortByField = 'description'
            } if (sortKey == 'response_data') {
                sortByField = 'recent_response_at'
            } if (sortKey == 'status') {
                sortByField = 'status'
            }
            // if (sortKey == 'user_name') {
            //     sortByField = 'full_name'
            // }


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
            getAllSupports({ page: 1, limit: limit, orderBy: sortByField, orderType: orderTypeField, search: searchString, status: status });

        }
    }

    //debounce on search String
    useEffect(() => {
        const delay = 500;
        const debounce = setTimeout(() => {
            if (searchString) {
                getAllSupports({
                    page: 1,
                    limit: router.query.limit as string,
                    search: searchString as string,
                    orderBy: router.query.order_by as string,
                    orderType: router.query.order_type as string,
                    status: router.query.status as string
                });
            } else {
                getAllSupports({
                    page: router.query.page as string,
                    limit: router.query.limit as string,
                    search: searchString as string,
                    orderBy: router.query.order_by as string,
                    orderType: router.query.order_type as string,
                    status: router.query.status as string
                });
            }
        }, delay);
        return () => clearTimeout(debounce);
    }, [searchString]);

    return (
        <div className={styles.supportDashboard}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 className="title">Support</h3>
                <div className={styles.tableFilters}>
                    <SearchComponent
                        onChange={(value: string) => setSearchString(value)}
                        placeholder={'Search By Title'}
                        setSearchString={setSearchString}
                        searchString={searchString}
                        value={searchString}
                    />
                    <SelectComponent options={statusOptions} size="small" onChange={onStatusChange} defaultValue={router.query.status ? router.query.status : ""} />
                    <ButtonComponent variant="contained" icon={<AddIcon />} title='ADD' onClick={() => router.push('/support/add')} />
                </div>
            </div>
            <SupportDataTable data={data} loading={loading} deleteSupport={deleteSupport} appliedSort={appliedSort} />
            {!loading ? <TablePaginationComponent paginationDetails={paginationDetails} capturePageNum={onPageChange} captureRowPerItems={onLimitChange} values='Queries' /> : ""}
            <LoadingComponent loading={loading} />
            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
        </div>
    )
}


export default SupportPage;