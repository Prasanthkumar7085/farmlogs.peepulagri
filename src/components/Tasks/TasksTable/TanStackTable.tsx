import {
    Column,
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
import { useState } from "react";

const TanStackTableComponent = ({ data, columns, paginationDetails, getData }: any) => {


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
    return (
        <div>
            <div>
                <div style={{ overflow: "scroll" }}>
                    <table border={1}>
                        <thead style={{ height: "40px", position: "sticky", top: "0px", background: "#b1d9ff" }}>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        console.log(header, 'test');

                                        return (
                                            <th key={header.id} colSpan={header.colSpan} style={{ minWidth: getWidth(header.id), width: getWidth(header.id) }}>
                                                {header.isPlaceholder ? null : (
                                                    <div {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}>
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: ' 🔼',
                                                            desc: ' 🔽',
                                                        }[header.column.getIsSorted() as string] ?? null}
                                                        {/* {header.column.getCanFilter() ? (
                                                        <div>
                                                            <Filter column={header.column} table={table} />
                                                        </div>
                                                    ) : null} */}
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
                                            return (
                                                <td key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
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
                            {/* {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()} */}

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













// function Filter({
//     column,
//     table,
// }: {
//     column: Column<any, any>
//     table: Table<any>
// }) {
//     const firstValue = table
//         .getPreFilteredRowModel()
//         .flatRows[0]?.getValue(column.id)

//     const columnFilterValue = column.getFilterValue()

//     return typeof firstValue === 'number' ? (
//         <div className="flex space-x-2">
//             <input
//                 type="number"
//                 value={(columnFilterValue as [number, number])?.[0] ?? ''}
//                 onChange={e =>
//                     column.setFilterValue((old: [number, number]) => [
//                         e.target.value,
//                         old?.[1],
//                     ])
//                 }
//                 placeholder={`Min`}
//                 className="w-24 border shadow rounded"
//             />
//             <input
//                 type="number"
//                 value={(columnFilterValue as [number, number])?.[1] ?? ''}
//                 onChange={e =>
//                     column.setFilterValue((old: [number, number]) => [
//                         old?.[0],
//                         e.target.value,
//                     ])
//                 }
//                 placeholder={`Max`}
//                 className="w-24 border shadow rounded"
//             />
//         </div>
//     ) : (
//         <input
//             type="text"
//             value={(columnFilterValue ?? '') as string}
//             onChange={e => column.setFilterValue(e.target.value)}
//             placeholder={`Search...`}
//             className="w-36 border shadow rounded"
//         />
//     )
// }