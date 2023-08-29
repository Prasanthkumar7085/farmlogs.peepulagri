import { useTable } from "react-table";
import NoDataComponent from "../Core/NoDataComponent";

const FarmTable = ({ columns, data, loading }: any) => {

    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        rows, // rows for the table based on the data passed
        prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
    } = useTable({
        columns: columns?.length ? columns : [],
        data: data?.length ? data : []
    });

    return (
        <div style={{ height: "70vh", overflow: "scroll" }} className="dataTable-container">
            <table className="table" {...getTableProps()} style={{ position: "sticky" }}>
                <thead className="thead">
                    {headerGroups.map((headerGroup: any, index: number) => (

                        <tr className="table-row" {...headerGroup.getHeaderGroupProps()} key={index}>
                            {headerGroup.headers.map((column: any, columnIndex: number) => {
                                return (
                                    <th className="cell" {...column.getHeaderProps()} key={columnIndex}>{column.render("Header")}</th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                {!loading && data?.length ?
                    <tbody className="tbody" {...getTableBodyProps()}>
                    {rows.map((row: any, index: number) => {
                        prepareRow(row);
                        return (
                            <tr className="table-row" {...row.getRowProps()} key={index}>
                                {row.cells.map((cell: any, cellIndex: number) => {
                                    return <td className="cell" {...cell.getCellProps()} key={cellIndex}>{cell.render("Cell")}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody> :
                    <tbody className="tbody" {...getTableBodyProps()}>
                    <tr>
                        <td colSpan={columns.length}> {!loading ? <NoDataComponent noData={data ? (!data.length) : true} /> : ""}</td>
                    </tr>
                    </tbody>
                }
            </table>
        </div>
    );
}

export default FarmTable;