import {
    SortingState,
    Table,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import { useState } from "react";

const TanStackTableComponent = ({ data, columns, paginationDetails, getData }: any) => {

    const router = useRouter();

    // const { has_more=false, limit=10, page=1, total=0, total_pages=0 } = paginationDetails;

    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: { sorting, },
        onSortingChange: setSorting,
        getSubRows: (row: any) => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    })


    const getWidth = (id: string) => {
        const widthObj = columns.find((item: any) => item.id == id);
        const width = widthObj?.width;
        return width
    }
    const sortAndGetData = (header: any) => {
        
        if (header.id == 'actions') {
            return
        }
        let orderBy = header.id;
        let orderType = 'asc';
        if (router.query.order_by as string == header.id) {
            if (router.query.order_type == 'asc') {
                orderType='desc'
            } else {
                orderBy = '';
                orderType = '';
            }
        } else {
            
        }
        console.log(header.id,orderBy,orderType,'asdf');
        
        getData({ limit:paginationDetails?.limit,page: 1, sortBy: orderBy, sortType: orderType });

    }
    return (
        <div>
            <div>
                <div style={{ overflow: "scroll" }}>
                    <table border={1}>
                        <thead style={{ height: "40px", position: "sticky", top: "0px", background: "#b1d9ff" }}>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        return (
                                            <th key={header.id} colSpan={header.colSpan} style={{ minWidth: getWidth(header.id), width: getWidth(header.id) }}>
                                                {header.isPlaceholder ? null : (
                                                    <div onClick={()=>sortAndGetData(header)}>
                                                        {
                                                            flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}{
                                                            router.query.order_by == header.id ?
                                                                router.query.order_type == 'asc'?' 🔼':' 🔽'
                                                            : ""
                                                        }
                                                    </div>
                                                )}
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => {
                                return (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => {
                                            // console.log(flexRender(
                                            //     cell.column.columnDef.cell,
                                            //     cell.getContext()
                                            // ));
                                            
                                            return (
                                                
                                                <td key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell,cell.getContext())}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="h-2" />
                <div className="flex items-center gap-2">
                    <button
                        className="border rounded p-1"
                        // onClick={() => table.previousPage()}
                        onClick={() => getData({ page: paginationDetails?.page - 1, limit: paginationDetails?.limit })}
                        disabled={paginationDetails?.page == 1 ? true : false}
                    // disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>
                    <button
                        className="border rounded p-1"
                        // onClick={() => table.nextPage()}
                        onClick={() => getData({ page: paginationDetails?.page + 1, limit: paginationDetails?.limit })}
                        disabled={!paginationDetails?.has_more}
                    // disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <span className="flex items-center gap-1">
                        <strong>
                            {`Page ${paginationDetails?.page} of ${paginationDetails?.total_pages}`}
                        </strong>
                    </span>
                    
                    {/* <span className="flex items-center gap-1">
                        | Go to page:
                        <input
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }}
                            className="border p-1 rounded w-16"
                        />
                    </span> */}
                    <select
                        value={paginationDetails?.limit}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                            getData({ page: 1, limit: Number(e.target.value) })
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div >
    )
}

export default TanStackTableComponent;