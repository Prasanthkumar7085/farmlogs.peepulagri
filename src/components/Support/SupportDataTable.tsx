import timePipe from "@/pipes/timePipe";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FarmTable from "../DashBoard/FarmTable";
import { SupportDataTableProps, SupportResponseDataType, categoriesType } from "@/types/supportTypes";
import { useRouter } from "next/router";

import { useSelector } from "react-redux";
import { CategoriesType } from "@/types/categoryTypes";
import { useEffect, useState } from "react";
import getAllCategoriesService from "../../../lib/services/Categories/getAllCategoriesService";



const SupportDataTable = ({ data, loading, deleteSupport, appliedSort }: SupportDataTableProps) => {

    const router = useRouter();

    const userType = useSelector((state: any) => state.auth.userDetails?.user_details?.user_type);


    const [categoriesList, setCategoriesList] = useState<Array<CategoriesType>>([]);


    const getAllCategories = async () => {
        const response = await getAllCategoriesService();
        if (response?.success) {
            setCategoriesList(response?.data);
        }
    }

    useEffect(() => {
        getAllCategories();
    }, [])


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

    const getColorOrTitle = (value: string, name: string) => {
        let index = categoriesList.findIndex((categoryItem: CategoriesType) => categoryItem.slug == value);

        if (name == 'color') {
            if (categoriesColors[index])
                return categoriesColors[index];
            return '#a4a6a9'
        } else {
            return categoriesList[index]?.category
        }


    }


    const columns = [   
        {
            columnId: "date",
            isSorted: true,
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
            columnId: "query_name",
            isSorted: true,
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
            columnId: "description",
            isSorted: true,
            Header: "Description",
            accessor: 'description'
        },
        {
            columnId: "response_date",
            isSorted: true,
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
            columnId: "status",
            isSorted: true,
            Header: "Status",
            accessor: 'status'
        },
        {
            columnId: "user_name",
            isSorted: true,
            Header: "User Name",
            show: userType === 'ADMIN',
            accessor: "user_id.full_name",
            // accessor: (row: SupportResponseDataType) => {
            //     return (
            //         <div style={{ color: "var(--body)" }}>
            //             {row.user_id?.full_name}
            //         </div>
            //     )
            // }
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