import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import ListAllFarmForDropDownService from "../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import addProcurementService from "../../../../lib/services/ProcurementServices/addProcurementService";
import getProcurementByIdService from "../../../../lib/services/ProcurementServices/getProcurementByIdService";
import updateProcurementService from "../../../../lib/services/ProcurementServices/updateProcurementService";
import styles from "./add-procurement-form.module.css";
import OperationDetails from "./operation-details";
import deleteAddProcurementService from "../../../../lib/services/ProcurementServices/deleteAddProcurementService";
import AddProcurementHeader from "./add-procurement-header";
import MaterialsRequired from "./materials-required";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";

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
  const [priority, setPriority] = useState("");
  const [materialCount, setMaterialCount] = useState<any>();
  const [afterProcurement, setAfterProcurement] = useState<any>(false);

  const getFarmOptions = async ({ searchString }: Partial<ApiProps>) => {
    setOptionsLoading(true)
    let location_id = "";
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
    finally {
      setOptionsLoading(false)

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
        priority: priority ? priority : "NONE",
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
        setAfterProcurement(true);
        router.push(`/procurements/add?material=true&procurement_id=${response?.data?._id}`)

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
          ? new Date(dateOfOperation)?.toUTCString()
          : "",
        remarks: remarks,
        priority: priority ? priority : "NONE",
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
        procurementId:
          (router.query.procurement_id as string) || procurementData?._id,
        body: data,
        token: accessToken,
      });
      if (response.status == 200 || response.status == 201) {
        toast.success(response?.message);
        setFarm([]);
        setAfterProcurement(true);
        if (router.pathname.includes("/edit")) {
          router.push(`/procurements/${procurementData?._id || router.query.procurement_id}/edit?material=true`)
        }
        else {
          router.push(`/procurements/add?material=true&procurement_id=${procurementData?._id || router.query.procurement_id}`)
        }
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
        procurementId:
          (router.query.procurement_id as string) || procurementData?._id,
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
        setPriority(response?.data?.priority);
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
        router.push("/procurements");
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
    setMaterialCount(value?.length);
  };

  return (
    <div style={{ paddingTop: "2rem" }}>
      <AddProcurementHeader data={procurementData} afterProcurement={afterProcurement} setAfterProcurement={setAfterProcurement} setDialogOpen={setDeleteOpen} />

      <form
        className={styles.addprocurementform}
        style={{ background: "#fff", borderRadius: "12px" }}
      >
        <div style={{ width: "100%" }}>
          <div style={{ padding: "1rem" }}>
            {router.query.material && router.isReady ? (
              <MaterialsRequired
                procurementData={procurementData}
                checkMaterialsListCount={checkMaterialsListCount}
                getProcurementData={getProcurementData}
              />
            ) : (
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
              />
            )}

            <div className={styles.formButtons}>
              <div className={styles.procurementFormBtn}>
                {(afterProcurement || router.query.material) &&
                  procurementData?._id ? (
                  <Button
                    className={styles.cancelBtn}
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      setAfterProcurement(false);
                      if (router.pathname.includes("/edit")) {
                        router.push(
                          `/procurements/${procurementData?._id || router.query.procurement_id
                          }/edit`
                        );
                      } else {
                        router.push(
                          `/procurements/add?procurement_id=${procurementData._id || router.query.procurement_id
                          }`
                        );
                      }
                    }}
                  >
                    Previous
                  </Button>
                ) : (
                  <Button
                    className={styles.cancelBtn}
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      if (procurementData?._id || router.query.procurement_id) {
                        setDeleteOpen(true);
                      } else {
                        router.push("/procurements");
                      }
                    }}
                  >
                    Cancel
                  </Button>
                )}

                {afterProcurement && procurementData?._id ? (
                  <Button
                    variant="contained"
                    className={
                      router.query.procurement_id || procurementData?._id
                        ? styles.disBtn
                        : styles.submitBtn
                    }
                    disabled={materialCount >= 1 ? false : true}
                    onClick={() => {
                      router.push("/procurements");
                    }}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    className={styles.submitBtn}
                    variant="contained"
                    onClick={() => {
                      router.pathname.includes("edit") || router.query.procurement_id
                        ? updateProcurement()
                        : addProcurement();
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <AlertDelete
          open={deleteOpen}
          deleteFarm={deleteProcurementApi}
          setDialogOpen={setDeleteOpen}
          loading={deleteLoading}
          deleteTitleProp={"Procurement"}
        />

        <LoadingComponent loading={loading} />
        <Toaster closeButton richColors position="top-right" />
      </form>
    </div>
  );
};

export default AddProcurementForm;
//


