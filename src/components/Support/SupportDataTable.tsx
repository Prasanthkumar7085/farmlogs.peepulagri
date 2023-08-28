import timePipe from "@/pipes/timePipe";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FarmTable from "../DashBoard/FarmTable";
import { SupportDataTableProps, SupportResponseDataType } from "@/types/supportTypes";
import { useRouter } from "next/router";



const SupportDataTable = ({ data, loading, deleteSupport, updateStatus }: SupportDataTableProps) => {

    const router = useRouter();
    const columns = [
        {
            Header: "Date",
            accessor: (row: SupportResponseDataType) => timePipe(row.createdAt, 'DD, MMM YYYY')
        },
        {
            Header: "Query Name",
            accessor: 'title'
        },
        {
            Header: "Category",
            accessor: (row: SupportResponseDataType) => {
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
            accessor: (row: SupportResponseDataType) => timePipe(row.recent_response_at, 'DD, MMM YYYY')
        },
        {
            Header: "Status",
            accessor: 'status'
        },
        {
            Header: "Actions",
            accessor: (row: SupportResponseDataType) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                        <IconButton onClick={() => router.push(`/support/${row._id}`)}>
                            <VisibilityIcon color='info' />
                        </IconButton>
                        <IconButton onClick={() => router.push(`/support/${row._id}/edit`)}>
                            <EditIcon color='warning' />
                        </IconButton>
                        <IconButton onClick={() => deleteSupport(row._id)}>
                            <DeleteIcon color='error' />
                        </IconButton>
                    </div>
                )
            }
        },
    ]

    return (
        <FarmTable columns={columns} data={data} loading={loading} />
    )
}


export default SupportDataTable;