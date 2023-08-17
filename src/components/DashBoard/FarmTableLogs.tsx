import timePipe from "@/pipes/timePipe";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FarmTable from "./FarmTable";
import farmData from "./result.json";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageComponent from "../Core/ImageComponent";

const FarmTableLogs = () => {

    const router = useRouter();

    const [farmId, setFarmId] = useState();
    const [data, setData] = useState(farmData.slice(0, 10));


    useEffect(() => {
        setFarmId(router.query.farm_id);

        if (router.query.farm_id == 1) {
            setData(farmData.slice(0, 10));
        } else if (router.query.farm_id == 2) {
            setData(farmData.slice(10, 20));
        } else if (router.query.farm_id == 3) {
            setData(farmData.slice(20, 30));
        } else if (router.query.farm_id == 4) {
            setData(farmData.slice(30, 40));
        } else if (router.query.farm_id == 5) {
            setData(farmData.slice(40, 50));
        }
    }, [router]);

    const getUpdatedResources = (rowDetails: any) => {

        if (rowDetails && rowDetails.length) {
            const updatedArray = rowDetails.map((item: any) => {
                if (item.title.toLowerCase() == 'tractor') {
                    return { ...item, logo: '/tractor.svg' }
                } else if (item.title.toLowerCase() == 'spayers') {
                    return { ...item, logo: '/sprayer.svg' }
                } else if (item.title.toLowerCase() == 'men') {
                    return { ...item, logo: '/man.svg' }
                } else if (item.title.toLowerCase() == 'women') {
                    return { ...item, logo: '/women.svg' }
                }
            })
            return updatedArray;
        }
    }

    const columns = [
        {
            Header: "Details",
            columns: [
                {
                    Header: "Date",
                    accessor: (row: any) => timePipe(row.created_at, 'DD, MMM YYYY')
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
                        console.log(updatedRowModules, 'data');


                        return (
                            <div style={{ display: "flex", gap: "2px" }}>
                                {updatedRowModules.length && updatedRowModules.map((item: any, index: number) => {
                                    console.log(item.logo, '000');

                                    return (
                                        <div key={index} style={{ border: ".1px solid #c1c1c1", borderRadius: "3px", display: "flex", itemAlign: "center", justifyContent: "center", padding: "5px" }} >
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
        <div>
            <FarmTable columns={columns} data={data} />
        </div>
    )
}

export default FarmTableLogs;