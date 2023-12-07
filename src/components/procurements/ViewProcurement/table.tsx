import type { NextPage } from "next";
import styles from "./table.module.css";
import { Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const ViewProcurementTable = ({ data }: any) => {
  return (
    <div>
      <hr />
      {data?.materials_required?.length ?

        <Table sx={{ minWidth: 650 }} aria-label="simple table">

          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Available</TableCell>
              <TableCell align="right">Procurement</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.materials_required?.map((row: any, index: any) => {
              return (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  key={index}
                >
                  <TableCell component="th" scope="row">
                    {row?.name}
                  </TableCell>
                  <TableCell align="right">{row?.calories}</TableCell>

                </TableRow>
              )
            })}
          </TableBody>
        </Table> : ''}
    </div>
  );
};

export default ViewProcurementTable;
