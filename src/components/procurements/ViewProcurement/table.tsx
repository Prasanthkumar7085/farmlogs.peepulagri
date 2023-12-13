import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import ImageComponent from "@/components/Core/ImageComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import updateMaterialStatusService from "../../../../lib/services/ProcurementServices/MaterialService/updateMaterialItemStatus";
import getMaterialsByProcurementIdService from "../../../../lib/services/ProcurementServices/getMaterialsByProcurementIdService";
const ViewProcurementTable = ({ data }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [materials, setMaterials] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  //update the status
  const onStatusChangeEvent = async (changedStatus: any, material_id: any) => {
    setLoading(true);
    try {
      const response = await updateMaterialStatusService({
        material_id: material_id,
        status: changedStatus,
        accessToken,
      });

      if (response.success) {
        setDialogOpen(false);
        getAllProcurementMaterials();
        toast.success(response?.message);
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else if (response?.status == 403) {
        logout();
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
      getAllProcurementMaterials();
    }
  }, [router.isReady, accessToken]);

  return (
    <div>
      <hr />
      {materials?.length ? (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Available(Qty)</TableCell>
              <TableCell>Procurement(Qty)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Approved By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials?.map((row: any, index: any) => {
              return (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  key={index}
                >
                  <TableCell>{row?.name ? row?.name : "---"}</TableCell>
                  <TableCell>
                    {row?.available_qty
                      ? row?.available_qty + " " + row.available_units
                      : "---"}
                  </TableCell>
                  <TableCell>
                    {row?.required_qty
                      ? row?.required_qty + " " + row.required_units
                      : "---"}
                  </TableCell>
                  <TableCell>{row?.status ? row?.status : "---"}</TableCell>
                  <TableCell>
                    {row?.approved_by ? row?.approved_by : "---"}
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {row?.status !== "APPROVED" ? (
                        <div style={{ cursor: "pointer" }}>
                          <IconButton
                            onClick={() =>
                              onStatusChangeEvent("reject", row?._id)
                            }
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </div>
                      ) : (
                        ""
                      )}
                      {row?.status !== "APPROVED" ? (
                        <div style={{ cursor: "pointer" }}>
                          <ImageComponent
                            src="/pencil-icon.svg"
                            height={17}
                            width={17}
                            alt="view"
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      <div style={{ cursor: "pointer" }}>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            onStatusChangeEvent("approve", row?._id)
                          }
                        >
                          {row?.status == "APPROVED"
                            ? "Add Purchase"
                            : "Approve"}
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        ""
      )}

      <LoadingComponent loading={loading} />
      {/* <AlertStautsChange open={dialogOpen} statusChange={onStatusChangeEvent} setDialogOpen={setDialogOpen} loading={loading} /> */}
    </div>
  );
};

export default ViewProcurementTable;
