import { TaskResponseTypes } from "@/types/tasksTypes";
import TanStackTableComponent from "./TanStackTable";
import { Button } from "@mui/material";
import { useRouter } from "next/router";


interface pageProps {
    data: Array<TaskResponseTypes> | any,
    getData: () => void;
    paginationDetails:any

}
const TasksTableComponent = ({ data, getData, paginationDetails }: any) => {

    const router = useRouter();


    const columns = [
        {
            accessorFn: (row: any) => row.createdAt,
            id: 'createdAt',
            cell: (info: any) => <span style={{ padding: "40px 10px 40px 10px" }}>{info.getValue().slice(0, 10)}</span>,
            header: () => <span>Created On</span>,
            footer: (props: any) => props.column.id,
            width: "200px"
        },
        {
            accessorFn: (row: any) => row.farm_id.title,
            id: 'farm_id.title',
            cell: (info: any) => <span style={{ padding: "40px 10px 40px 10px" }}>{info.getValue()}</span>,
            header: () => <span>Farm Name</span>,
            footer: (props: any) => props.column.id,
            width: "200px"
        },
        
        {
            accessorFn: (row: any) => row.title,
            id: 'title',
            cell: (info: any) => <span style={{ wordWrap: 'break-word', padding: "40px 10px 40px 10px" }}>{info.getValue()}</span>,
            header: () => <span style={{ maxWidth: "400px" }}>Title</span>,
            footer: (props: any) => props.column.id,
            width: "400px"
        },
        {
            accessorFn: (row: any) => row.description,
            id: 'description',
            cell: (info: any) => <span style={{ padding: "40px 10px 40px 10px" }}>{info.getValue()}</span>,
            header: () => <span>Description</span>,
            footer: (props: any) => props.column.id,
            width: "200px"
        },
        {
            accessorFn: (row: any) => row.deadline,
            id: 'deadline',
            cell: (info: any) => <span style={{ padding: "40px 10px 40px 10px" }}>{info.getValue()?.slice(0,10)}</span>,
            header: () => <span>Due Date</span>,
            footer: (props: any) => props.column.id,
            width: "200px"
        },
        {
            accessorFn: (row: any) => row.status,
            id: 'status',
            cell: (info: any) => <span style={{ padding: "40px 10px 40px 10px" }}>{info.getValue()}</span>,
            header: () => <span>Status</span>,
            footer: (props: any) => props.column.id,
            width: "200px"
        },
        {
            // accessorFn: (row: any) => row.description,
            id: 'actions',
            cell: (info: any) => <span style={{ padding: "40px 10px 40px 10px" }}>{
                <div>
                    <Button onClick={() => console.log(info.row.original?._id)}>View</Button>
                    <Button onClick={() => router.push(`/tasks/${info.row.original?._id}/edit`)}>Edit</Button>
                    <Button onClick={()=>console.log(info.row.original)}>Delete</Button>
                </div>
            }</span>,
            header: () => <span>Actions</span>,
            footer: (props: any) => props.column.id,
            width: "200px"
        },

    ]
    return (
        <div>
            <TanStackTableComponent data={data} columns={columns} paginationDetails={paginationDetails} getData={getData} />
        </div>
    )
}

export default TasksTableComponent;