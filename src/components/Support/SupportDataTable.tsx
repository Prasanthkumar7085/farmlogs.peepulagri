import timePipe from "@/pipes/timePipe";
import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FarmTable from "../DashBoard/FarmTable";
import getAllSupportService from "../../../lib/services/getAllSupportService";


const SupportDataTable = () => {

    const [data, setData] = useState<any>();


    const getAllSupports = async () => {


        try {
            const response = await getAllSupportService();
            setData(response.data);

        } catch (err: any) {
            console.error(err);

        }
    }
    useEffect(() => {
        getAllSupports();
    }, [])

    const columns = [
        {
            Header: "Details",
            columns: [
                {
                    Header: "Date",
                    accessor: (row: any) => timePipe(row.created_at, 'DD, MMM YYYY')
                },
                {
                    Header: "Query Name",
                    accessor: 'title'
                },
                {
                    Header: "Category",
                    accessor: (row: any) => {
                        return (
                            <div style={{ display: "flex" }}>
                                {row.categories.length && row.categories.map((item: string, index: number) => {
                                    return <Chip label={item} key={index} sx={{ margin: "2px" }} />
                                })}
                            </div>
                        )
                    }
                },
                {
                    Header: "Description",
                    accessor: 'description'
                },
                {
                    Header: "Response Date",
                    accessor: (row: any) => timePipe(row.recent_response_at, 'DD, MMM YYYY')
                },
                {
                    Header: "Status",
                    accessor: 'status'
                },
                {
                    Header: "Actions",
                    accessor: () => {
                        return (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                                <IconButton>
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
        <FarmTable columns={columns} data={data} />
    )
}


export default SupportDataTable;