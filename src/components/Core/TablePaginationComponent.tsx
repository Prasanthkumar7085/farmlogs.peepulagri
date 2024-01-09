
import { Card, MenuItem, Pagination, Select, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./table-pagination.module.css";


const TablePaginationComponent = ({ paginationDetails, capturePageNum, captureRowPerItems, values }: any) => {

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

  const [limitOptions] = useState(
    router.pathname == "/tasks" || router.pathname == "/procurements"
      ? [15, 30, 50, 100, 200, 300]
      : [10, 25, 50, 100]
  );

  return (
    <Card className={styles.tablePagination}>
      <div>
        <Typography variant="caption" className={styles.label}>
          {values} Per Page
        </Typography>

        <Select
          value={noOfRows}
          onChange={handlePagerowChange}
          defaultValue={router?.query?.limit ? router?.query?.limit : 15}
          sx={{
            height: "25px !important",
            borderRadius: "3px !important",
            fontSize: "11px",
            border: "none",
          }}
        >
          {limitOptions.map((item: number) => (
            <MenuItem value={item} key={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div>
        <Typography variant="caption">
          {" "}
          {(paginationDetails?.page == 1
            ? 1
            : (paginationDetails?.page - 1) * paginationDetails?.limit + 1) +
            " - " +
            (paginationDetails?.page == paginationDetails?.total_pages
              ? paginationDetails?.total
              : paginationDetails?.total < paginationDetails?.limit
                ? paginationDetails?.total
                : paginationDetails?.page * paginationDetails?.limit)}{" "}
          of {paginationDetails?.total} {values}
        </Typography>
      </div>

      <Pagination
        shape="rounded"
        sx={{
          "& .MuiButtonBase-root": {
            height: "25px !important",
            // width: "25px !important",
            minWidth: "inherit",
          },
        }}
        page={paginationDetails?.page}
        count={paginationDetails?.total_pages}
        onChange={(event: any, value: any) => {
          capturePageNum(value);
          setPageNum(+value);
        }}
      />
    </Card>
  );
}
export default TablePaginationComponent;