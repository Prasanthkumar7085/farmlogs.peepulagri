import timePipe from "@/pipes/timePipe";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FarmTable from "../DashBoard/FarmTable";
import { SupportDataTableProps, SupportResponseDataType, categoriesType } from "@/types/supportTypes";
import { useRouter } from "next/router";



const SupportDataTable = ({ data, loading, deleteSupport, updateStatus }: SupportDataTableProps) => {

    const router = useRouter();
    const categoryOptions: Array<categoriesType> = [

        { title: 'Input Resources', value: "input_resources", color: "#66BB6A", textColor: "#ffffff" },
        { title: 'Irrigation', value: "irrigation", color: "#64B5F6", textColor: "#ffffff" },
        { title: 'Tools', value: "tools", color: "#FFD54F", textColor: "#ffffff" },
        { title: 'Harvesting', value: "harvesting", color: "#AB47BC", textColor: "#ffffff"  },
        { title: 'Alerts', value: "alerts", color: "#AED581", textColor: "#ffffff"  },
        { title: 'Notifications', value: "notifications", color: "#9575CD", textColor: "#ffffff"  },
        { title: 'Climate & Weather', value: "climate_and_weather", color: "#FF8A65", textColor: "#ffffff"  },
        { title: 'Dashboard', value: "dashboard", color: "#FFD700", textColor: "#ffffff"  },
        { title: 'New Features', value: "new_features", color: "#FF80AB", textColor: "#ffffff"  },
        { title: 'Data Analysis', value: "data_analysis", color: "#78909C", textColor: "#ffffff"  },
        { title: 'Bug & Trouble Shooting', value: "bug_and_touble_shooting", color: "#26A69A", textColor: "#ffffff"  },
    ];

    const getColorOrTitle = (item: any, field: string) => {
        let value: any = (categoryOptions.find((categoryItem: categoriesType) => categoryItem.value.toLowerCase() == item.toLowerCase()))
        return value[field]
    }
    // const getTitle = (item: any) => {
    //     return (categoryOptions.find((categoryItem: categoriesType) => categoryItem.value.toLowerCase() == item.toLowerCase()))?.title
    // }
    const appliedSort = async (sortKey: string) => {
        if (sortKey) {
            console.log(sortKey);

        }
    }

    const columns = [   
        {
            Header: "Date",
            accessor: (row: SupportResponseDataType) => {
                return (
                    <div style={{ color: "var(--body)" }}>
                        { timePipe(row.createdAt, 'DD, MMM YYYY') }
                    </div>
                    )
            }
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
                            return <Chip label={getColorOrTitle(item, 'title')} key={index} sx={{ margin: "2px", color: "white", backgroundColor: getColorOrTitle(item, 'color') }} />
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
            accessor: (row: SupportResponseDataType) => {
                return (
                    <div style={{ color: "var(--body)" }}>
                        { timePipe(row.recent_response_at, 'DD, MMM YYYY') }
                    </div>
                    )
            }
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
                            <img src="/view-icon.svg" alt="view" width="18" />
                        </IconButton>
                        <IconButton onClick={() => router.push(`/support/${row._id}/edit`)}>
                            <img src="/pencil-icon.svg" alt="view" width="18" />
                        </IconButton>
                        <IconButton onClick={() => deleteSupport(row._id)}>
                            <img src="/trast-icon.svg" alt="view" width="18" />
                        </IconButton>
                    </div>
                )
            }
        },
    ]

    return (
        <FarmTable columns={columns} data={data} loading={loading} appliedSort={appliedSort} />
    )
}


export default SupportDataTable;