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
    const statusOptions = [
        { value: 'OPEN', title: 'Open' },
        { value: 'INPROGRESS', title: "Inprogress" },
        { value: 'RESOLVED', title: "Resolved" },
        { value: 'ARCHIVE', title: "Archive" }
    ];

    const updateStatus = async (value: string, id: string) => {
        let response = await updateSupportStatusService({ status: value }, id);

    }

    const getAllSupports = async ({ page = 1, limit = 10, searchString = '', status = '' }: Partial<SupportServiceTypes>) => {
        setLoading(true);
        try {
            const response = await getAllSupportService({ page: page, limit: limit, searchString: searchString, status: status, accessToken: accessToken });
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
        getAllSupports({ page: 1, limit: limit, searchString: searchString, status: value });
    }

    const onPageChange = (value: string | number) => {
        setPage(value);
        getAllSupports({ page: value, limit: limit, searchString: searchString, status: status });

    }
    const onLimitChange = (value: string | number) => {
        setPage(1);
        setLimit(value)
        getAllSupports({ page: 1, limit: value, searchString: searchString, status: status });
    }

    const [alertMessage, setAlertMessage] = useState<string>('');
    const [alertType, setAlertType] = useState<boolean>(false);

    const deleteSupport = async (id: string) => {
        setLoading(true)
        try {
            let response = await deleteASupportService(id);

            if (response.success) {
                setAlertMessage(response.message);
                setAlertType(true);
                getAllSupports({ page: page, limit: limit, searchString: searchString, status: status })
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


    //debounce on search String
    useEffect(() => {
        const delay = 500;
        const debounce = setTimeout(() => {
            if (router?.isReady && accessToken) {
                getAllSupports({ page: 1, limit: limit, searchString: searchString });
            }
        }, delay);
        return () => clearTimeout(debounce);
    }, [searchString, router.isReady, accessToken]);

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
                    <SelectComponent options={statusOptions} size="small" onChange={onStatusChange} defaultValue='' />
                    <ButtonComponent variant="contained" icon={<AddIcon />} title='ADD' onClick={() => router.replace('/support/add')} />
                </div>
            </div>
            <SupportDataTable data={data} loading={loading} deleteSupport={deleteSupport} updateStatus={updateStatus} />
            {!loading ? <TablePaginationComponent paginationDetails={paginationDetails} capturePageNum={onPageChange} captureRowPerItems={onLimitChange} values='Queries' /> : ""}
            <LoadingComponent loading={loading} />
            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
        </div>
    )
}


export default SupportPage;