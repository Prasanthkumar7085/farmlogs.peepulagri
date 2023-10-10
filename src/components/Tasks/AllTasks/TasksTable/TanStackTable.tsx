import TablePaginationComponent from "@/components/Core/TablePaginationComponent";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useState } from "react";

const TanStackTableComponent = ({
  data,
  columns,
  paginationDetails,
  getData,
}: any) => {
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getSubRows: (row: any) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const getWidth = (id: string) => {
    const widthObj = columns.find((item: any) => item.id == id);
    const width = widthObj?.width;
    return width;
  };
  const sortAndGetData = (header: any) => {
    if (header.id == "actions") {
      return;
    }
    let orderBy = header.id;
    let orderType = "asc";
    if ((router.query.order_by as string) == header.id) {
      if (router.query.order_type == "asc") {
        orderType = "desc";
      } else {
        orderBy = "";
        orderType = "";
      }
    }

    getData({
      limit: router.query.limit as string,
      page: 1,
      sortBy: orderBy,
      sortType: orderType,
      search_string: router.query.search_string as string,
      selectedFarmId: router.query.farm_id as string,
      status: router.query.status as string,
    });
  };

  const capturePageNum = (value: number) => {
    getData({
      limit: router.query.limit as string,
      page: value,
      sortBy: router.query.order_by as string,
      sortType: router.query.order_type as string,
      search_string: router.query.search_string as string,
      selectedFarmId: router.query.farm_id as string,
      status: router.query.status as string,
    });
  };

  const captureRowPerItems = (value: number) => {
    getData({
      limit: value,
      page: 1,
      sortBy: router.query.order_by as string,
      sortType: router.query.order_type as string,
      search_string: router.query.search_string as string,
      selectedFarmId: router.query.farm_id as string,
      status: router.query.status as string,
    });
  };
  return (
    <div>
      <div>
        <div style={{ overflow: "scroll" }}>
          <table border={1}>
            <thead
              style={{
                height: "40px",
                position: "sticky",
                top: "0px",
                background: "#b1d9ff",
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          minWidth: getWidth(header.id),
                          width: getWidth(header.id),
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div onClick={() => sortAndGetData(header)}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {router.query.order_by == header.id
                              ? router.query.order_type == "asc"
                                ? " 🔼"
                                : " 🔽"
                              : ""}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      // console.log(flexRender(
                      //     cell.column.columnDef.cell,
                      //     cell.getContext()
                      // ));

                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="h-2" />

        <TablePaginationComponent
          paginationDetails={paginationDetails}
          capturePageNum={capturePageNum}
          captureRowPerItems={captureRowPerItems}
          values="Tasks"
        />
      </div>
    </div>
  );
};

export default TanStackTableComponent;
