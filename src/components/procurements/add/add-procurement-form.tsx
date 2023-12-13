import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import LoadingComponent from "@/components/Core/LoadingComponent";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
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

interface ApiProps {
  page: number;
  searchString: string;
}
const AddProcurementForm: NextPage = () => {
  const dispatch = useDispatch();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);
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

  const [procurementData, setProcurementData] = useState({});

  const getFarmOptions = async ({ searchString }: Partial<ApiProps>) => {
    try {
      let response = await ListAllFarmForDropDownService(
        searchString as string,
        accessToken
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
      removeCookie("userType");
      loggedIn("loggedIn");
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

        setTimeout(() => {
          router.push(`/procurements/${response?.data?._id}/edit`);
        }, 1000);
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
        procurementId: router.query.procurement_id as string,
        body: data,
        token: accessToken,
      });
      if (response.status == 200 || response.status == 201) {
        toast.success(response?.message);
        setFarm([]);
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
        procurementId: router.query.procurement_id as string,
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
    setDeleteLoading(true);
    try {
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
  return (
    <div>
      <form className={styles.addprocurementform}>
        <div className={styles.formgroup}>
          {router.query.procurement_id ? (
            <Button
              variant="outlined"
              sx={{ color: "red", borderColor: "red" }}
              onClick={() => setIsDisabled(!isDisabled)}
            >
              {router.query.procurement_id && isDisabled ? (
                <EditOutlinedIcon />
              ) : (
                <CancelOutlinedIcon />
              )}
            </Button>
          ) : (
            ""
          )}
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
            isDisabled={isDisabled}
            setIsDisabled={setIsDisabled}
          />
        </div>
        {isDisabled ? (
          ""
        ) : (
          <div className={styles.modalActions}>
            <div className={styles.buttonsgroup}>
              <Button
                color="primary"
                variant="outlined"
                onClick={() => {
                  router.query.procurement_id
                    ? deleteProcurement()
                    : router.back();
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  router.query.procurement_id
                    ? updateProcurement()
                    : addProcurement();
                }}
              >
                {router.query.procurement_id ? "Update" : "Submit"}
              </Button>
            </div>
          </div>
        )}

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
      <POC
        procurementData={procurementData}
        getProcurementData={getProcurementData}
      />
    </div>
  );
};

export default AddProcurementForm;
