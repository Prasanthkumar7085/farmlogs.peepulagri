import ButtonComponent from "../Core/ButtonComponent";
import SearchComponent from "../Core/SearchComponent";
import AddIcon from '@mui/icons-material/Add';
import SupportDataTable from "./SupportDataTable";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getAllSupportService from "../../../lib/services/SupportService/getAllSupportService";
import { SupportResponseDataType, SupportServiceTypes } from "@/types/supportTypes";
import SelectComponent from "../Core/SelectComponent";
import TablePaginationComponent from "../Core/TablePaginationComponent";
import LoadingComponent from "../Core/LoadingComponent";

const SupportPage = () => {

    const router = useRouter();

    const [searchString, setSearchString] = useState<string>('');
    const [page, setPage] = useState<string | number>(1);
    const [limit, setLimit] = useState<string | number>(10);
    const [status, setStatus] = useState<string | number>('')
    const [paginationDetails, setPaginationDetails] = useState();
    const [data, setData] = useState<Array<SupportResponseDataType> | null>();
    const [loading, setLoading] = useState(false);
    const statusOptions = [
        { value: 'OPEN', title: 'Open' },
        { value: 'INPROGRESS', title: "Inprogress" },
        { value: 'RESOLVED', title: "Resolved" },
        { value: 'ARCHIVED', title: "Archived" }
    ];

    const getAllSupports = async ({ page = 1, limit = 10, searchString = '', status = '' }: Partial<SupportServiceTypes>) => {
        setLoading(true);
        try {
            const response = await getAllSupportService({ page: page, limit: limit, searchString: searchString, status: status });
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
        setStatus(e.target.value);
        getAllSupports({ page: 1, limit: limit, searchString: searchString, status: status });
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

    //debounce on search String
    useEffect(() => {
        const delay = 1000;
        const debounce = setTimeout(() => {
            getAllSupports({ page: 1, limit: limit, searchString: searchString });
        }, delay);
        return () => clearTimeout(debounce);
    }, [searchString]);

    return (
        <div style={{ margin: "30px 30px 0px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>Support</h3>
                <div style={{ display: "flex", justifyContent: "space-around", width: "500px" }}>
                    <SearchComponent onChange={(value: string) => setSearchString(value)} placeholder={'Search By Title'} />
                    <SelectComponent options={statusOptions} onChange={onStatusChange} />
                    <ButtonComponent icon={<AddIcon />} title='ADD' onClick={() => router.push('/support/add')} />
                </div>
            </div>
            <SupportDataTable data={data} loading={loading} />
            {!loading ? <TablePaginationComponent paginationDetails={paginationDetails} capturePageNum={onPageChange} captureRowPerItems={onLimitChange} values='Queries' /> : ""}
            <LoadingComponent loading={loading} />
        </div>
    )
}


export default SupportPage;