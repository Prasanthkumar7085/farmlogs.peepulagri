
import { Card, MenuItem, Pagination, Select, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./table-pagination.module.css";


const TablePaginationForFarms = ({ paginationDetails, capturePageNum, captureRowPerItems, values }: any) => {

    const router = useRouter();
    const [pageNum, setPageNum] = useState<number | string>();
    const [noOfRows, setNoOfRows] = useState<number | string>(paginationDetails?.limit);

    useEffect(() => {
        setNoOfRows(paginationDetails?.limit)
    }, [paginationDetails]);

    const handlePagerowChange = (event: any) => {
        setNoOfRows(event.target.value);
        captureRowPerItems(event.target.value)
        setPageNum(1);
    };

    return (
        <Card className={styles.tablePagination} sx={{ position: 'sticky', bottom: "0px", width: "100%" }}>
            <div>
                <Typography variant="caption" className={styles.label}>{values} Per Page</Typography>

                <Select
                    value={noOfRows}
                    onChange={handlePagerowChange}
                    defaultValue={router?.query?.limit ? router?.query?.limit : 10}
                    sx={{
                        height: "25px !important", borderRadius: "3px !important", fontSize: "11px",
                        border: "none"
                    }}
                >
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={80}>80</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>


            </div>
            <div>
                <Typography variant="caption" > {
                    (paginationDetails?.page == 1 ? 1 :
                        ((paginationDetails?.page - 1) * paginationDetails?.limit) + 1)
                    + ' - ' + ((paginationDetails?.page == paginationDetails?.total_pages) ?
                        (paginationDetails?.total)
                        : ((paginationDetails?.total < paginationDetails?.limit) ?
                            paginationDetails?.total :
                            (paginationDetails?.page * paginationDetails?.limit)))
                } of {
                        paginationDetails?.total
                    } {values}</Typography>
            </div>

            <Pagination shape="rounded"
                sx={{
                    '& .MuiButtonBase-root': {
                        height: "25px !important",
                        width: "25px !important",
                        minWidth: "inherit",

                    },
                }}
                page={+paginationDetails?.page}
                count={paginationDetails?.total_pages}
                onChange={(event: any, value: any) => {
                    capturePageNum(value)
                    setPageNum(+value)
                }}
            />
        </Card>
    )
}
export default TablePaginationForFarms;