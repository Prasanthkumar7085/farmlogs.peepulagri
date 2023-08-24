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
import getLogsByFarmId from "../../../lib/services/LogsService/getLogsByFarmId";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TablePaginationComponent from "../Core/TablePaginationComponent";
import { GetLogsByFarmIdPropsType, PaginationDetailsType } from "@/types/farmCardTypes";
import SearchComponent from "../Core/SearchComponent";
import { Button } from "@mui/material";
import Link from "next/link";


const FarmTableLogs = () => {

    const router: any = useRouter();

    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [paginationDetails, setPaginationDetails] = useState<PaginationDetailsType | null>();
    const [page, setPage] = useState<number | string>(1);
    const [limit, setLimit] = useState<number | string>(10);
    const [searchString, setSearchString] = useState<string>('');


    useEffect(() => {
        getFarmLogs({ farmId: router.query.farm_id, page: router.query.page, limit: router.query.limit });
    }, [router]);

    const getFarmLogs = async ({ farmId = router.query.farm_id, page = 1, limit = 10, search = searchString }: Partial<GetLogsByFarmIdPropsType>) => {
        setLoading(true);
        try {
            const response = await getLogsByFarmId({ farmId: farmId, page: page, limit: limit, search: search });
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

    const getUpdatedResources = (rowDetails: any) => {

        if (rowDetails && rowDetails.length) {
            const updatedArray = rowDetails.map((item: any) => {
                if (item.title.toLowerCase() == 'tractor') {
                    return { ...item, logo: '/tractor.svg' }
                } else if (item.title.toLowerCase() == "sprayers" || item.title.toLowerCase() == "spayers") {
                    return { ...item, logo: '/sprayer.svg' }
                } else if (item.title.toLowerCase() == 'men') {
                    return { ...item, logo: '/man.svg' }
                } else if (item.title.toLowerCase() == 'women') {
                    return { ...item, logo: '/women.svg' }
                } else {
                    return { ...item, logo: '/' }
                }
            })
            return updatedArray;
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

    const columns = [
        {
            Header: "Details",
            columns: [
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
                                    <Chip label={item} key={index} sx={{ margin: "2px" }} />
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
                        const updatedRowModules = getUpdatedResources(row.resources);
                        return (
                            <div style={{ display: "flex", gap: "2px" }}>
                                {updatedRowModules.length && updatedRowModules.map((item: any, index: number) => {
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
                    accessor: () => {
                        return (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                                <IconButton onClick={() => router.push('/farm/1/logs/5')}>
                                    <VisibilityIcon color='info' />
                                </IconButton>
                                <IconButton>
                                    <EditIcon color='warning' />
                                </IconButton>
                                <IconButton>
                                    <DeleteIcon color='error' />
                                </IconButton>
                            </div>
                        )
                    }
                },
            ],
        },
    ]


    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "40px", paddingRight: "20px" }}>
                <SearchComponent onChange={searchStringChange} placeholder={'Search By Title'} />
                <Link href="/farm/[farm_id]/logs/add" as={`/farm/${router.query.farm_id}/logs/add`} style={{ textDecoration: "none", color: "#000000" }}>
                    <Button>
                        Add Log
                    </Button>
                </Link>
            </div>
            <FarmTable columns={columns} data={data} />
            <TablePaginationComponent paginationDetails={paginationDetails} capturePageNum={capturePageNum} captureRowPerItems={captureRowPerItems} values='Logs' />
            <Backdrop
                sx={{ display: "flex", gap: "10px", flexDirection: "column", color: "#0088d1", backgroundColor: "rgba(256, 256, 256, 0.5)", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress />
                Loading...
            </Backdrop>
        </div>
    )
}

export default FarmTableLogs;