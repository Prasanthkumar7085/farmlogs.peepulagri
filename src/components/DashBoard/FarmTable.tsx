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
        <div style={{ height: "70vh", overflow: "scroll" }}>
            <table {...getTableProps()} style={{ position: "sticky" }}>
            <thead>
                    {headerGroups.map((headerGroup: any, index: number) => (

                        <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                            {headerGroup.headers.map((column: any, columnIndex: number) => {
                                return (
                                <th {...column.getHeaderProps()} key={columnIndex}>{column.render("Header")}</th>
                                )
                            })}
                    </tr>
                ))}
            </thead>
                {!loading && data?.length ? <tbody {...getTableBodyProps()}>
                    {rows.map((row: any, index: number) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={index}>
                            {row.cells.map((cell: any, cellIndex: number) => {
                                return <td style={{ padding: "10px", border: ".1px solid" }} {...cell.getCellProps()} key={cellIndex}>{cell.render("Cell")}</td>;
                            })}
                        </tr>
                    );
                })}
                </tbody> :
                    <tr>
                        <td colSpan={columns.length}> <NoDataComponent noData={data ? !data.length : true} /></td>
                    </tr>
                }
        </table>
        </div>
    );
}

export default FarmTable;