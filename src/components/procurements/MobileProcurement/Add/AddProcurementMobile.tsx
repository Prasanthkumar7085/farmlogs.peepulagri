import { Button, Chip, MenuItem, Select, TextField } from "@mui/material";
import styles from "./addProcurementMobile.module.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ChangeEvent, useEffect, useState } from "react";
import FarmAutoCompleteInAddProcurement from "../../add/FarmAutoCompleteInAddProcurement";
import ListAllFarmForDropDownService from "../../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "@mui/material/TextField";
import ViewProcurementHeader from "../View/viewProcurement-header";
import ErrorMessages from "@/components/Core/ErrorMessages";
import addProcurementService from "../../../../../lib/services/ProcurementServices/addProcurementService";
import { toast } from "sonner";
import { useRouter } from "next/router";
import AddMaterialMobile from "./AddMaterialMobile";
import getProcurementByIdService from "../../../../../lib/services/ProcurementServices/getProcurementByIdService";
import LoadingComponent from "@/components/Core/LoadingComponent";
import updateProcurementService from "../../../../../lib/services/ProcurementServices/updateProcurementService";

interface ApiProps {
  page: number;
  searchString: string;
}
const AddProcurementMobile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [title, setTitle] = useState("");
  const [dateOfOperation, setDataOfOperation] = useState<Date | null>(null);
  const [remarks, setRemarks] = useState("");
  const [farmOptions, setFarmOptions] = useState([]);
  const [farm, setFarm] = useState<{ title: string; _id: string }[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [editFarms, setEditFarms] = useState<
    { title: string; _id: string }[] | []
  >([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [priority, setPriority] = useState("NONE");
  const [procurementData, setProcurementData] = useState<any>({});
  const [afterProcurement, setAfterProcurement] = useState<any>(false);
  const [materialCount, setMaterialCount] = useState<any>();

  const [options] = useState<Array<{ value: string; title: string }>>([
    { title: "Low", value: "LOW" },
    { title: "Medium", value: "MEDIUM" },
    { title: "High", value: "HIGH" },
  ]);

  const getFarmOptions = async ({ searchString }: Partial<ApiProps>) => {
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
  };

  const checkMaterialsListCount = (value: any) => {
    setMaterialCount(value?.length);
  };

  const onSelectFarmFromDropDown = async (value: any, reason: string) => {
    setFarm(value);
    if (reason == "clear") {
      getFarmOptions({});
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

        // setTimeout(() => {
        //   router.push(`/procurements/${response?.data?._id}/edit`);
        // }, 1000);
      } else if (response.status == 422) {
        setErrorMessages(response?.errors);
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
        await getProcurementData();
        setIsDisabled(true);
      } else if (response.status == 422) {
        setErrorMessages(response?.errors);
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

  const deleteEditedFarms = (id: string) => {
    let data = editFarms?.length
      ? editFarms.filter((item) => item._id != id)
      : [];
    setEditFarms(data);
  };

  return (
    <div>
      <ViewProcurementHeader
        title={
          router.query.procurement_id ? "Edit Procurement" : "Add Procurement"
        }
      />

      <div className={styles.addprocurment}>
        {afterProcurement == false ? (
          <div className={styles.formfieds}>
            <div className={styles.dateofoperation}>
              <div className={styles.lable}>
                <label className={styles.label}>
                  Name of Operation <span style={{ color: "red" }}>*</span>{" "}
                </label>
              </div>
              <TextField
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    backgroundColor: "#fff !important",
                  },
                }}
                size="small"
                placeholder="Enter Title"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
              />
              <ErrorMessages errorMessages={errorMessages} keyname={"title"} />
            </div>
            <div className={styles.dateofoperation}>
              <div className={styles.lable}>
                <label className={styles.label}>
                  Date of Operation <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  sx={{
                    background: "#fff",
                    width: "100%",
                    marginBottom: "4px",
                  }}
                  disablePast
                  value={dateOfOperation}
                  format="dd/MM/yyyy"
                  onChange={(newValue: any) => {
                    setDataOfOperation(newValue);
                  }}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      size: "small",
                      color: "primary",
                    },
                  }}
                />
              </LocalizationProvider>
              <ErrorMessages
                errorMessages={errorMessages}
                keyname={"date_of_operation"}
              />
            </div>
            <div style={{ width: "100%" }}>
              <div className={styles.lable}>
                <label className={styles.label}>
                  Select Farms <span style={{ color: "red" }}>*</span>
                </label>
              </div>
              <FarmAutoCompleteInAddProcurement
                options={farmOptions}
                onSelectFarmFromDropDown={onSelectFarmFromDropDown}
                label={"title"}
                placeholder={"Select Farms here"}
                defaultValue={farm}
                optionsLoading={optionsLoading}
                setOptionsLoading={setOptionsLoading}
                searchString={searchString}
                setSearchString={setSearchString}
                editFarms={editFarms}
              />
              <ErrorMessages
                errorMessages={errorMessages}
                keyname={"farm_ids"}
              />

              <div
                style={{
                  display:
                    router.query.procurement_id && editFarms?.length
                      ? "flex"
                      : "none",
                }}
              >
                {router.query.procurement_id && editFarms?.length
                  ? editFarms.map((item, index) => {
                      return (
                        <div key={index} style={{ display: "flex" }}>
                          <Chip
                            label={item.title}
                            key={item._id}
                            clickable
                            onDelete={() => deleteEditedFarms(item._id)}
                          />
                        </div>
                      );
                    })
                  : ""}
              </div>
            </div>
            <div className={styles.dateofoperation}>
              <div className={styles.lable}>
                <label className={styles.label}>Priority </label>
              </div>
              <Select
                size="small"
                sx={{
                  marginBottom: "8px",
                  width: "100%",
                  background: "#fff",
                  color: "#6A7185",
                  fontWeight: "300",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "13.5px",
                }}
                placeholder="Select Priority"
                onChange={(e: any) => setPriority(e.target.value)}
                value={priority}
              >
                {options?.length &&
                  options.map(
                    (item: { value: string; title: string }, index: number) => {
                      return (
                        <MenuItem
                          sx={{
                            minHeight: "inherit !important",
                            fontSize: "clamp(12px, 2.5vw, 14px)",
                            fontFamily: "'Inter', sans-serif",
                            color: "#000",
                          }}
                          key={index}
                          value={item.value}
                        >
                          {item.title}
                        </MenuItem>
                      );
                    }
                  )}
              </Select>
            </div>
            <div className={styles.dateofoperation}>
              <div className={styles.lable}>
                <label className={styles.label}>Remarks</label>
              </div>
              <TextArea
                sx={{ background: "#fff", width: "100%" }}
                color="primary"
                multiline
                minRows={3}
                placeholder="Enter your remarks here"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <AddMaterialMobile
            procurementData={procurementData}
            checkMaterialsListCount={checkMaterialsListCount}
            getProcurementData={getProcurementData}
          />
        )}

        <div className={styles.procurementFormBtn}>
          {afterProcurement && procurementData?._id ? (
            <Button
              className={styles.cancelBtn}
              color="primary"
              variant="outlined"
              onClick={() => {
                setAfterProcurement(false);
              }}
            >
              Prev
            </Button>
          ) : (
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
          )}

          {afterProcurement && procurementData?._id ? (
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
          ) : (
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
            </Button>
          )}
        </div>
        {/* <ButtonGroup fillButton="Next" buttonGroupGap="1rem" /> */}
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default AddProcurementMobile;
