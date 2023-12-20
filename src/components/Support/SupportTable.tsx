import { useTable } from "react-table";
import NoDataComponent from "../Core/NoDataComponent";
import ImageComponent from "../Core/ImageComponent";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";


const SupportTable = ({ columns, data, loading, appliedSort }: any) => {

    const userType_v2 = useSelector(
      (state: any) => state.auth.userDetails?.user_details?.user_type
    );
    const router = useRouter();

    const getHiddenColumns = () => {

        if (userType_v2 !== "ADMIN") return ["user_id.full_name"];
        return []
    }
    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        rows, // rows for the table based on the data passed
        prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
    } = useTable({
        columns: columns?.length ? columns : [],
        data: data?.length ? data : [],
        initialState: {
            hiddenColumns: getHiddenColumns()
        }
    });

    return (
        <div style={{ height: "calc(100vh - 160px)", overflow: "auto", marginTop: "15px" }} className="dataTable-container scrollbar">
            <table className="table" {...getTableProps()} style={{ position: "sticky" }}>
                <thead className="thead" style={{
                    position: "sticky",
                    top: "-1px",
                    zIndex: 1,
                }}>
                    {headerGroups.map((headerGroup: any, index: number) => (

                        <tr className="table-row" {...headerGroup.getHeaderGroupProps()} key={index}>
                            {headerGroup.headers.map((column: any, columnIndex: number) => {
                                return (
                                    <th className="cell" {...column.getHeaderProps()} key={columnIndex} onClick={() => appliedSort(column?.columnId)}
                                        style={{
                                            cursor: column?.isSorted ? "pointer" : "default",
                                            width: (column?.width ? column?.width : ""),
                                            minWidth: (column?.minWidth ? column?.minWidth : ""),
                                            maxWidth: (column?.maxWidth ? column?.maxWidth : ""),
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            {column.render("Header")}
                                            {column.isSorted ?
                                                <span>
                                                    {router.query.order_by == column?.sortId ?
                                                        (router.query.order_type == 'asc' ?
                                                            <ImageComponent src='/sort-asc.svg' height={15} width={15} alt='image' /> :
                                                            <ImageComponent src='/sort-desc.svg' height={15} width={15} alt='image' />)
                                                        : <ImageComponent src='/unsort.svg' height={15} width={15} alt='image' />}
                                                </span>
                                                : ""}
                                        </div>
                                    </th>
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
                                        const cellValue = cell.render('Cell').props.value;
                                        return <td className="cell" {...cell.getCellProps()} key={cellIndex}>
                                            {cellValue ? cellValue : 'NA'}
                                        </td>

                                    })}
                                </tr>
                            );
                        })}
                    </tbody> :
                    <tbody className="tbody" {...getTableBodyProps()}>
                        <tr>
                            <td style={{ width: "100%", height: "calc(100vh - 210px)", textAlign: "center" }} colSpan={columns.length}> {!loading ? <NoDataComponent noData={data ? (!data.length) : true} /> : ""}</td>
                        </tr>
                    </tbody>
                }
            </table>
        </div>
    );
}

export default SupportTable;

// (!cell.column.show && userType_v2 == 'ADMIN') ? (<td className="cell" {...cell.getCellProps()} key={cellIndex}>{cell.render("Cell")}</td>) : null