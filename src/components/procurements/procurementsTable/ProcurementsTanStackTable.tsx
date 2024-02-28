import ImageComponent from "@/components/Core/ImageComponent";
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
const TanStackTableProcurmentComponent = ({
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
    if (
      header.id == "actions" ||
      header.id == "farm_id.title" ||
      header.id == "assigned_to" ||
      header.id == "status" ||
      header.id == "priority" ||
      header.id == "id" ||
      header.id == "requested_by.name"
    ) {
      return;
    }
    let orderBy = header.id;
    let orderType = "asc";
    if ((router.query.sort_by as string) == header.id) {
      if (router.query.sort_type == "asc") {
        orderType = "desc";
      } else {
        orderBy = "";
        orderType = "";
      }
    }
    getData({
      limit: router.query.limit as string,
      page: 1,
      search_string: router.query.search_string as string,
      sortBy: orderBy,
      sortType: orderType,
      selectedFarmId: router.query.farm_id as string,
      status: router.query.status as string,
      priority: router.query.priority as string,
      userId: router.query.requested_by
        ? Array.isArray(router.query.requested_by)
          ? (router.query.requested_by as string[])
          : ([router.query.requested_by] as string[])
        : [],
      isMyTasks: router.query.is_my_task as string,
    });
  };
  const capturePageNum = (value: number) => {
    getData({
      limit: router.query.limit as string,
      page: value,
      search_string: router.query.search_string as string,
      sortBy: router.query.order_by as string,
      sortType: router.query.order_type as string,
      selectedFarmId: router.query.farm_id as string,
      status: router.query.status as string,
      priority: router.query.priority as string,
      userId: router.query.requested_by
        ? Array.isArray(router.query.requested_by)
          ? (router.query.requested_by as string[])
          : ([router.query.requested_by] as string[])
        : [],
      isMyTasks: router.query.is_my_task as string,
    });
  };
  const captureRowPerItems = (value: number) => {
    getData({
      limit: value,
      page: 1,
      search_string: router.query.search_string as string,
      sortBy: router.query.order_by as string,
      sortType: router.query.order_type as string,
      selectedFarmId: router.query.farm_id as string,
      status: router.query.status as string,
      priority: router.query.priority as string,
      userId: router.query.requested_by
        ? Array.isArray(router.query.requested_by)
          ? (router.query.requested_by as string[])
          : ([router.query.requested_by] as string[])
        : [],
      isMyTasks: router.query.is_my_task as string,
    });
  };
  return (
    <div>
      <div>
        <div
          style={{ overflow: "scroll", height: "80vh" }}
          className="dataTable-container scrollbar"
        >
          <table
            className="table"
            border={0}
            style={{ borderSpacing: "0 !important" }}
          >
            <thead
              className="thead"
              style={{
                height: "32px",
                position: "sticky",
                top: "0px",
                zIndex: "2"
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr className="table-row" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        className="cell"
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          minWidth: getWidth(header.id),
                          width: getWidth(header.id),
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            onClick={() => sortAndGetData(header)}
                            style={{
                              display: "flex",
                              gap: "10px",
                              cursor: "pointer",
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {router.query.sort_by == header.id ? (
                              router.query.sort_type == "asc" ? (
                                <ImageComponent
                                  src="/sort-asc.svg"
                                  height={15}
                                  width={15}
                                  alt="image"
                                />
                              ) : (
                                <ImageComponent
                                  src="/sort-desc.svg"
                                  height={15}
                                  width={15}
                                  alt="image"
                                />
                              )
                            ) : header.id == "farm_id.title" || header.id == "id" ||
                              header.id == "requested_by.name" || header.id == "point_of_contact.name" ||
                              header.id == "status" || header.id == "priority" ? (
                              ""
                            ) : (
                              <ImageComponent
                                src="/unsort.svg"
                                height={15}
                                width={15}
                                alt="image"
                              />
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="tbody">
              {table.getFilteredRowModel().rows.map((row) => {

                return (
                  <tr className="table-row" key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td className="cell" key={cell.id}>
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
          values="Procurements"
        />
      </div>
    </div>
  );
};
export default TanStackTableProcurmentComponent;
