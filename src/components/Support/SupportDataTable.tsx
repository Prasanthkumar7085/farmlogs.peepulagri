import timePipe from "@/pipes/timePipe";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FarmTable from "../DashBoard/FarmTable";
import { SupportResponseDataType } from "@/types/supportTypes";


const SupportDataTable = ({ data, loading }: { data: Array<SupportResponseDataType> | null | undefined, loading: Boolean }) => {

    const columns = [
                {
                    Header: "Date",
            accessor: (row: any) => timePipe(row.createdAt, 'DD, MMM YYYY')
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
    ]

    return (
        <FarmTable columns={columns} data={data} loading={loading} />
    )
}


export default SupportDataTable;