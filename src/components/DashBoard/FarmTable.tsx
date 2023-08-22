import { useTable } from "react-table";

const FarmTable = ({ columns, data }: any) => { 

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
                                if (column.Header === "Details") {
                                    return null; // This will hide the header
                                }
                                return (
                                <th {...column.getHeaderProps()} key={columnIndex}>{column.render("Header")}</th>
                                )
                            })}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
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
            </tbody>
        </table>
        </div>
    );
}

export default FarmTable;