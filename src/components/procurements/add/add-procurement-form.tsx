import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import LoadingComponent from "@/components/Core/LoadingComponent";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import ListAllFarmForDropDownService from "../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import addProcurementService from "../../../../lib/services/ProcurementServices/addProcurementService";
import getProcurementByIdService from "../../../../lib/services/ProcurementServices/getProcurementByIdService";
import updateProcurementService from "../../../../lib/services/ProcurementServices/updateProcurementService";
import POC from "../edit/POC";
import styles from "./add-procurement-form.module.css";
import OperationDetails from "./operation-details";
import deleteAddProcurementService from "../../../../lib/services/ProcurementServices/deleteAddProcurementService";
import AddProcurementHeader from "./add-procurement-header";
import MaterialsRequired from "./materials-required";

interface ApiProps {
  page: number;
  searchString: string;
}
const AddProcurementForm = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const userDetails = useSelector(
    (state: any) => state.auth.userDetails?.user_details
  );
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dateOfOperation, setDataOfOperation] = useState<Date | null>(null);
  const [remarks, setRemarks] = useState("");
  const [farmOptions, setFarmOptions] = useState([]);
  const [farm, setFarm] = useState<{ title: string; _id: string }[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [editFarms, setEditFarms] = useState<
    { title: string; _id: string }[] | []
  >([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [procurementData, setProcurementData] = useState<any>({});
  const [priority, setPriority] = useState('NONE')
  const [materialCount, setMaterialCount] = useState<any>()
  const [afterProcurement, setAfterProcurement] = useState<any>(false)

  const getFarmOptions = async ({ searchString }: Partial<ApiProps>) => {
    let location_id = ""
    try {
      let response = await ListAllFarmForDropDownService(
        searchString as string,
        accessToken,
        location_id
      );
      if (response.success) {
        setFarmOptions(response?.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSelectFarmFromDropDown = async (value: any, reason: string) => {
    setFarm(value);
    if (reason == "clear") {
      getFarmOptions({});
    }
  };

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

  const addProcurement = async () => {
    setLoading(true);
    setErrorMessages({});
    try {
      let data = {
        title: title,
        date_of_operation: dateOfOperation
          ? new Date(dateOfOperation)?.toISOString()
          : "",
        remarks: remarks,
        priority: priority,
        farm_ids: farm?.length
          ? farm.map((item: { _id: string }) => item._id)
          : [],
      };

      const response = await addProcurementService({
        body: data,
        token: accessToken,
      });
      if (response.status == 200 || response.status == 201) {
        toast.success(response?.message);
        setProcurementData(response?.data);
        setAfterProcurement(true)

        // setTimeout(() => {
        //   router.push(`/procurements/${response?.data?._id}/edit`);
        // }, 1000);
      } else if (response.status == 422) {
        setErrorMessages(response?.errors);
      } else if (response.status == 403) {
        await logout();
      } else if (response.status == 401) {
        toast.error(response?.message);
      } else {
        throw response;
      }
    } catch (err) {
      toast.error("Something went wrong!" || err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProcurement = async () => {
    setLoading(true);
    setErrorMessages({});
    try {
      let data = {
        title: title,
        date_of_operation: dateOfOperation
          ? new Date(dateOfOperation)?.toISOString()
          : "",
        remarks: remarks,
        priority: priority,
        farm_ids: [
          ...(farm?.length
            ? farm.map((item: { _id: string }) => item._id)
            : []),
          ...(editFarms?.length
            ? editFarms.map((item: { _id: string }) => item._id)
            : []),
        ],
      };

      const response = await updateProcurementService({
        procurementId: router.query.procurement_id as string || procurementData?._id,
        body: data,
        token: accessToken,
      });
      if (response.status == 200 || response.status == 201) {
        toast.success(response?.message);
        setFarm([]);
        setAfterProcurement(true)
        await getProcurementData();
        setIsDisabled(true);
      } else if (response.status == 422) {
        setErrorMessages(response?.errors);
      } else if (response.status == 403) {
        await logout();
      } else if (response.status == 401) {
        toast.error(response?.message);
      } else {
        throw response;
      }
    } catch (err) {
      toast.error("Something went wrong!" || err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getProcurementData = async () => {
    setLoading(true);
    try {
      const response = await getProcurementByIdService({
        procurementId: router.query.procurement_id as string || procurementData?._id,
        accessToken: accessToken,
      });
      if (response?.status == 200 || response?.status == 201) {
        setProcurementData(response?.data);
        setIsDisabled(true);
        setDataOfOperation(
          response?.data?.date_of_operation
            ? new Date(response?.data?.date_of_operation)
            : null
        );

        setRemarks(response?.data?.remarks);
        setTitle(response?.data?.title);
        setEditFarms(response?.data?.farm_ids);
        setPriority(response?.data?.priority)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProcurement = () => {
    setDeleteOpen(true);
  };

  const deleteProcurementApi = async () => {
    try {
      const response = await deleteAddProcurementService({
        procurementId: router.query.procurement_id,
        token: accessToken,
      });
      if (response?.status == 200 || response?.status == 201) {
        toast.success(response?.message);
        router.back();
      } else if (response?.status == 401) {
        toast.error(response?.message);
      } else if (response?.status == 403) {
        logout();
      } else {
        toast.error("Something went wrong");
        throw response;
      }

      setDeleteLoading(true);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };
  useEffect(() => {
    if (router.isReady && accessToken) {
      if (router.query.procurement_id) {
        getProcurementData();
      }
      let delay = 500;
      let debounce = setTimeout(() => {
        getFarmOptions({ searchString: searchString });
      }, delay);
      return () => clearTimeout(debounce);
    }
  }, [router.isReady, accessToken, searchString]);

  const checkMaterialsListCount = (value: any) => {

    setMaterialCount(value?.length)
  }


  return (
    <div style={{ paddingTop: "2rem" }}>
      <AddProcurementHeader />

      <form className={styles.addprocurementform} style={{ background: "#fff", borderRadius: "12px" }}>
        <div style={{ width: "100%" }}>
          <div style={{ padding: "1rem" }}>
            {afterProcurement ?
              <MaterialsRequired
                procurementData={procurementData}
                checkMaterialsListCount={checkMaterialsListCount}
                getProcurementData={getProcurementData} />

              :
              <OperationDetails
                farmOptions={farmOptions}
                onSelectFarmFromDropDown={onSelectFarmFromDropDown}
                label={"title"}
                placeholder={"Select Farm here"}
                defaultValue={farm}
                optionsLoading={optionsLoading}
                setOptionsLoading={setOptionsLoading}
                searchString={searchString}
                setSearchString={setSearchString}
                title={title}
                setTitle={setTitle}
                dateOfOperation={dateOfOperation}
                setDataOfOperation={setDataOfOperation}
                remarks={remarks}
                setRemarks={setRemarks}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
                editFarms={editFarms}
                setEditFarms={setEditFarms}
                setIsDisabled={setIsDisabled}
                priority={priority}
                setPriority={setPriority}
              />}

            <div className={styles.formButtons} >

              <div className={styles.procurementFormBtn}>
                {afterProcurement && procurementData?._id ?
                  <Button
                    className={styles.cancelBtn}
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      setAfterProcurement(false)
                    }}
                  >
                    Prev

                  </Button>
                  :
                  <Button
                    className={styles.cancelBtn}
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      router.back();
                    }}
                  >
                    Cancel
                  </Button>
                }

                {afterProcurement && procurementData?._id ?
                  <Button
                    variant="contained"
                    className={styles.submitBtn}
                    disabled={materialCount >= 1 ? false : true}
                    onClick={() => {
                      router.back();
                    }}
                  >
                    Submit
                  </Button>
                  :
                  <Button
                    className={styles.submitBtn}
                    variant="contained"
                    onClick={() => {
                      router.query.procurement_id || procurementData?._id
                        ? updateProcurement()
                        : addProcurement();
                    }}
                  >
                    Next
                  </Button>}
              </div>

            </div>

          </div>
        </div>

        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <DialogContent>
            <h4>Do you want to delete the Procurement?</h4>
          </DialogContent>
          <DialogActions>
            <div>
              <Button variant="outlined" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => deleteProcurementApi()}
              >
                {deleteLoading ? (
                  <CircularProgress size="1.5rem" sx={{ color: "white" }} />
                ) : (
                  "Yes! Delete"
                )}
              </Button>
            </div>
          </DialogActions>
        </Dialog>
        <LoadingComponent loading={loading} />
        <Toaster closeButton richColors position="top-right" />
      </form>

    </div>
  );
};

export default AddProcurementForm;
//


