import timePipe from "@/pipes/timePipe";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";

import { SupportDataTableProps, SupportResponseDataType, categoriesType } from "@/types/supportTypes";
import { useRouter } from "next/router";

import { useSelector } from "react-redux";
import { CategoriesType } from "@/types/categoryTypes";
import { useEffect, useState } from "react";
import getAllCategoriesService from "../../../lib/services/Categories/getAllCategoriesService";
import SupportTable from "./SupportTable";



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
            sortId: "createdAt",
            isSorted: true,
            Header: "Date",
            width: "80px",
            accessor: (row: SupportResponseDataType) => {
                return (
                    <div style={{ color: "var(--body)" }}>
                        {timePipe(row.createdAt, 'DD, MMM YYYY')}
                    </div>
                    )
            }
        },
        {
            columnId: "query_name",
            sortId: "title",
            isSorted: true,
            Header: "Query Name",
            accessor: 'title',
            minWidth: "150px",
            maxWidth: "300px",
        },
        {
            Header: "Category",
            minWidth: "150px",
            maxWidth: "400px",
            accessor: (row: SupportResponseDataType) => {
                return (
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {row.categories.length && row.categories.map((item: string, index: number) => {
                            return <Chip label={getColorOrTitle(item, 'title')} key={index} sx={{ margin: "2px", color: "white", backgroundColor: getColorOrTitle(item, 'color') }} />
                        })}
                    </div>
                )
            }
        },
        {
            columnId: "description",
            sortId: "description",
            isSorted: true,
            minWidth: "250px",
            Header: "Description",
            accessor: 'description'
        },
        {
            columnId: "response_date",
            isSorted: true,
            sortId: "recent_response_at",
            Header: "Response Date",
            maxWidth: "140px",
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
            sortId: "status",
            Header: "Status",
            // accessor: 'status',
            accessor: (row: SupportResponseDataType) => {
                return (
                    <div style={{ color: "var(--body)" }}>
                        {row?.status ? row.status.slice(0,1).toUpperCase()+row.status.slice(1,).toLowerCase(): "NA"}
                    </div>
                )
            },
            width: "80px",
        },
        {
            // columnId: "user_name",
            // isSorted: true,
            Header: "User Name",
            maxWidth: "80px",
            show: userType === 'ADMIN',
            accessor: "user_id.full_name"
        },
        {

            Header: "Actions",
            maxWidth: "120px",
            accessor: (row: SupportResponseDataType) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                        <IconButton onClick={() => router.push(`/support/${row._id}`)}>
                            <img src="/view-icon.svg" alt="view" width="18" />
                        </IconButton>
                        {userType !== 'ADMIN' ? <IconButton onClick={() => router.push(`/support/${row._id}/edit`)}>
                            <img src="/pencil-icon.svg" alt="view" width="18" />
                        </IconButton> : ""}
                        <IconButton onClick={() => deleteSupport(row)}>
                            <img src="/trast-icon.svg" alt="view" width="18" />
                        </IconButton>
                    </div>
                )
            }
        },
    ]

    return (
        <SupportTable columns={columns} data={data} loading={loading} appliedSort={appliedSort} />
    )
}


export default SupportDataTable;