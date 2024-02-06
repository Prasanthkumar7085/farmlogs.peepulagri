import { Cancel, Delete, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Button,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import styles from "../add/add-procurement-form.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import getAllUsersService from "../../../../lib/services/Users/getAllUsersService";
import { Toaster, toast } from "sonner";
import { useCookies } from "react-cookie";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import LoadingComponent from "@/components/Core/LoadingComponent";
import addPOCService from "../../../../lib/services/ProcurementServices/POCService/addPOCService";
import ErrorMessages from "@/components/Core/ErrorMessages";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import deletePOCService from "../../../../lib/services/ProcurementServices/POCService/deletePOCService";
const POC = ({
  procurementData,
  getProcurementData,
}: {
  procurementData: any;
  getProcurementData: () => void;
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [usersData, setUsersData] = useState([]);
  const [poc, setPOC] = useState<Partial<{ _id: string; name: string }> | any>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDeletePOC, setShowDeletePOC] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const logout = async () => {
    try {
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };

  const addPOCtoProcurement = async () => {
    setErrors({});
    setLoading(true);
    try {
      const body = {
        point_of_contact: poc?._id,
      };
      const response = await addPOCService({
        token: accessToken,
        procurementId: router.query.procurement_id as string || procurementData?._id,
        body: body as { point_of_contact: string },
      });
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.message);
        getProcurementData();

      } else if (response?.status == 422) {
        setErrors(response?.errors);
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else if (response?.status == 403) {
        logout();
      } else {
        toast.error("Something went wrong");
        throw response;
      }
    } catch (err) {
      console.error();
    } finally {
      setLoading(false);
    }
  };
  const getAllUsers = async () => {
    try {
      const response = await getAllUsersService({ token: accessToken });
      if (response?.status == 200 || response?.status == 201) {
        setUsersData(response?.data);
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
    }
  };

  const deletePOC = async () => {
    setDeleteLoading(true);
    try {
      const body = {
        point_of_contact: procurementData?.point_of_contact?._id,
      };
      const response = await deletePOCService({
        token: accessToken,
        procurementId: router.query.procurement_id as string || procurementData?._id,
        body: body as { point_of_contact: string },
      });
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.message);
        setShowDeletePOC(false);
        setPOC(null)
        getProcurementData();
      } else if (response?.status == 422) {
        toast.error(response?.message);
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
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllUsers();
    }
  }, [router.isReady, accessToken]);

  return (
    <div>
      <div className={styles.personofcontact}>
        <h3 className={styles.label}>Person of Contact (POC)</h3>
        <div className={styles.pocSelectBlock}>
          <div >

            {poc?.name || procurementData?.point_of_contact?._id ? (
              <div
                className={styles.selectedPOC}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "2rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Avatar
                    sx={{
                      fontSize: "12px",
                      width: "30px",
                      height: "30px",
                      background: "#45a845",
                    }}
                  >
                    {poc?.name?.split(" ")?.length > 1 || procurementData?.point_of_contact?.name.split(" ")?.length > 1
                      ? poc?.name?.slice(0, 2)?.toUpperCase() ||
                      `${procurementData?.point_of_contact?.name.split(" ")[0][0]}${procurementData?.point_of_contact?.name.split(" ")[1][0]
                        }`.toUpperCase()
                      : poc?.name?.slice(0, 2)?.toUpperCase() || procurementData?.point_of_contact?.name.slice(0, 2)?.toUpperCase()}
                  </Avatar>
                  <div>{poc?.name || procurementData?.point_of_contact?.name}</div>
                </div>
                {procurementData?.point_of_contact?._id ? (
                  <div>
                    <Button
                      onClick={() => {
                        setShowDeletePOC(true);
                      }}
                      variant="outlined"
                      className={styles.removePOCBtn}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <Autocomplete
                disablePortal
                size="small"
                id="combo-box-demo"
                options={usersData && usersData?.length ? usersData : []}
                getOptionLabel={(option: any) =>
                  option.name ? option.name?.toUpperCase() : ""
                }
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option?._id}>
                      {option?.name}
                    </li>
                  );
                }}
                value={poc}
                onChange={(e: any, value: any, reason: any) => {
                  setPOC(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={"Select POC to this Procurement"}
                    sx={{ width: "100%", background: "#fff" }}
                    onChange={(e) => { }}
                  />
                )}
                sx={{
                  width: "100%",
                  background: "#fff",
                  "& .MuiInputBase-input ": {
                    fontSize: "13px",
                    fontWeight: "400",
                    fontFamily: "'inter', sans-serif ",
                    color: "#000",
                  },
                }}
              />
            )}
            {/* <ErrorMessages errorMessages={errors} keyname={"point_of_contact"} /> */}
          </div>
          <div>

            {!procurementData?.point_of_contact?._id ? (
              <Button className={styles.conformPocbtn}
                variant="outlined"
                onClick={addPOCtoProcurement}
                disabled={poc?.name ? false : true}
              >Confirm</Button>
            ) : (
              ""
            )}
          </div>
        </div>

      </div>

      <AlertDelete
        open={showDeletePOC}
        deleteFarm={deletePOC}
        setDialogOpen={setShowDeletePOC}
        loading={deleteLoading}
        deleteTitleProp={"POC"}
      />

      <LoadingComponent loading={loading} />
      <Toaster closeButton position="top-right" richColors />
    </div>
  );
};

export default POC;
