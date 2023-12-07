import type { NextPage } from "next";
import { Button } from "@mui/material";
import OperationDetails from "./operation-details";
import MaterialsRequired from "./materials-required";
import styles from "./add-procurement-form.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import ListAllFarmForDropDownService from "../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import addProcurementService from "../../../../lib/services/ProcurementServices/addProcurementService";
import { Toaster, toast } from "sonner";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { useCookies } from "react-cookie";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";

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
  const [dateOfOperation, setDataOfOperation] = useState("");
  const [remarks, setRemarks] = useState("");

  const [farmOptions, setFarmOptions] = useState([]);
  const [farm, setFarm] = useState<{ title: string; _id: string }[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});

  const getFarmOptions = async ({ searchString }: Partial<ApiProps>) => {
    try {
      let response = await ListAllFarmForDropDownService(
        searchString as string,
        accessToken
      );
      if (response.success) {
        setFarmOptions(response?.data);
      }
      console.log(response);
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
        console.log(response);

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

  useEffect(() => {
    if (router.isReady && accessToken) {
      let delay = 500;
      let debounce = setTimeout(() => {
        getFarmOptions({ searchString: searchString });
      }, delay);
      return () => clearTimeout(debounce);
    }
  }, [router.isReady, accessToken, searchString]);
  return (
    <form className={styles.addprocurementform}>
      <div className={styles.formgroup}>
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
        />
        {/* <MaterialsRequired /> */}
      </div>
      <div className={styles.modalActions}>
        <div className={styles.buttonsgroup}>
          <Button color="primary" variant="outlined">
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={addProcurement}>
            Submit
          </Button>
        </div>
      </div>
      <LoadingComponent loading={loading} />
      <Toaster closeButton richColors position="top-right" />
    </form>
  );
};

export default AddProcurementForm;
