import type { NextPage } from "next";
import styles from "./table.module.css";
import { Divider, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import getMaterialsByProcurementIdService from "../../../../lib/services/ProcurementServices/getMaterialsByProcurementIdService";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import { toast } from "sonner";
import LoadingComponent from "@/components/Core/LoadingComponent";

const ViewProcurementTable = ({ data }: any) => {


  const dispatch = useDispatch();
  const router = useRouter()

  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);


  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);


  //logout function for 403 error
  const logout = async () => {
    try {
      removeCookie("userType");
      loggedIn("loggedIn");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };

  //get all materials list
  const getAllProcurementMaterials = async () => {
    setLoading(true);
    try {
      let response = await getMaterialsByProcurementIdService({
        token: accessToken,
        procurementId: router.query.procurement_id as string,
      });
      if (response?.status == 200 || response?.status == 201) {
        setMaterials(response?.data);
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else if (response?.status == 403) {
        logout();
      } else {
        toast.error("Something went wrong");
        throw response;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //api calls
  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllProcurementMaterials()
    }
  }, [router.isReady, accessToken])

  return (
    <div>
      <hr />
      {materials?.length ?

        <Table sx={{ minWidth: 650 }} aria-label="simple table">

          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell >Available(Qty)</TableCell>
              <TableCell >Procurement(Qty)</TableCell>
              <TableCell >Status</TableCell>


            </TableRow>
          </TableHead>
          <TableBody>
            {materials?.map((row: any, index: any) => {
              return (
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  key={index}
                >
                  <TableCell >
                    {row?.name ? row?.name : "---"}
                  </TableCell>
                  <TableCell >{row?.available_qty ? row?.available_qty + " " + row.available_units : "---"}</TableCell>
                  <TableCell >{row?.required_qty ? row?.required_qty + " " + row.required_units : "---"}</TableCell>
                  <TableCell >{row?.status ? row?.status : "---"}</TableCell>
                  {row.approved_by ? <TableCell >{row?.approved_by ? row?.approved_by : "---"}</TableCell> : ""}
                </TableRow>
              )
            })}
          </TableBody>
        </Table> : ''}

      <LoadingComponent loading={loading} />

    </div>
  );
};

export default ViewProcurementTable;
