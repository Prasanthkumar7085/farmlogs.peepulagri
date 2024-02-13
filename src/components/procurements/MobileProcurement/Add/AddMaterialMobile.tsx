import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import POC from "../../edit/POC";
import styles from "./add-materials.module.css";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import getMaterialsByProcurementIdService from "../../../../../lib/services/ProcurementServices/getMaterialsByProcurementIdService";
import { useSelector } from "react-redux";
import addProcurementMaterialService from "../../../../../lib/services/ProcurementServices/addProcurementMaterialService";
import ErrorMessages from "@/components/Core/ErrorMessages";
import ProcurementDetailsMobile from "./procurement-details";
import POCMobile from "../../edit/POC-mobile";
import Image from "next/image";
import LoadingComponent from "@/components/Core/LoadingComponent";
import deleteProcurmentByIdService from "../../../../../lib/services/ProcurementServices/deleteProcurmentByIdService";


interface ApiCallService {
  procurement_req_id: string;
  name: string;
  required_qty: number | null;
  required_units: string;
  available_qty?: number | null;
  available_units?: string;
}

const AddMaterialMobile = ({ procurementData, checkMaterialsListCount, getProcurementData }: any) => {

  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [name, setName] = useState("");
  const [requiredQty, setRequiredQty] = useState<null | number | string>(null);
  const [requiredUnits, setRequiredUnits] = useState("");
  const [availableQty, setAvailableQty] = useState<null | number | string>(
    null
  );
  const [rejectedMaterials, setRejectedMaterial] = useState<any>();

  const [availableUnits, setAvailableUnits] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [materials, setMaterials] = useState([]);
  const [deleteMaterialOpen, setDeleteMaterialOpen] = useState(false);
  const [deleteMaterialId, setDeleteMaterialId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editMaterialOpen, setEditMaterialOpen] = useState(false);
  const [editMaterialData, setEditMaterialData] = useState({});
  const [editNameValue, setEditNameValue] = useState<string>("");
  const [editRequiredQty, setEditRequiredQty] = useState<
    null | number | string
  >(null);
  const [editRequiredUnits, setEditRequiredUnits] = useState<string>("");
  const [editAvailableQty, setEditAvailableQty] = useState<
    null | number | string
  >(null);
  const [editAvailableUnits, setEditAvailableUnits] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editMaterialId, setEditMaterialId] = useState("");
  const [editErrorMessages, setEditErrorMessages] = useState({});

  const [shouldRedirect, setShouldRedirect] = useState(false);

  const deleteProcurment = async () => {
    setDeleteLoading(true);

    const response = await deleteProcurmentByIdService({
      procurmentId: procurementData?._id,
      token: accessToken,
    });
    if (response?.success) {

    } else {
      toast.error(response?.message);
    }
  };


  // // Add event listener for page reload
  // useEffect(() => {
  //   const confirmationHandler = (event: any) => {
  //     event.preventDefault();

  //     // Ask for confirmation
  //     const confirmationMessage = 'Are you sure you want to reload the page?';
  //     event.returnValue = confirmationMessage; // For legacy browsers
  //     return confirmationMessage;
  //   };

  //   window.addEventListener('beforeunload', confirmationHandler);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('beforeunload', confirmationHandler);
  //   };
  // }, []);

  // // Add event listener for confirmation of reload
  // useEffect(() => {
  //   const unloadHandler = (event: any) => {
  //     event.preventDefault();

  //     // Call the API when the user confirms the reload
  //     deleteProcurment();
  //   };

  //   window.addEventListener('unload', unloadHandler);

  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('unload', unloadHandler);
  //   };
  // }, []);


  const getAllProcurementMaterials = async () => {
    setLoading(true);
    try {
      let response = await getMaterialsByProcurementIdService({
        token: accessToken,
        procurementId:
          (router.query.procurement_id as string),
      });
      if (response?.status == 200 || response?.status == 201) {
        const RejectFilterData = response?.data.filter(
          (obj: any) => obj.status == "REJECTED"
        );
        const remaining = response?.data.filter(
          (obj: any) => obj.status !== "REJECTED"
        );
        setMaterials(remaining);
        setRejectedMaterial(RejectFilterData);
        checkMaterialsListCount(response?.data);
      } else if (response?.status == 401) {
        toast.error(response?.message);
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

  useEffect(() => {
    if (router.isReady && accessToken && router.query.procurement_id) {
      getAllProcurementMaterials();
      getProcurementData()
    }
  }, [router.isReady, accessToken, router.query.procurement_id]);

  const addMaterial = async () => {
    setLoading(true);
    setErrorMessages({});
    try {
      const body = {
        procurement_req_id:
          router.query.procurement_id || procurementData?._id,
        name: name,
        required_qty: requiredQty ? +requiredQty : null,
        required_units: requiredUnits,
        available_qty: availableQty ? +availableQty : null,
        available_units: requiredUnits,
      };
      const response = await addProcurementMaterialService({
        token: accessToken,
        body: body as ApiCallService,
      });

      if (response?.status == 200 || response?.status == 201) {
        setName("");
        setRequiredQty("");
        setRequiredUnits("");
        setAvailableQty("");
        setAvailableUnits("");

        toast.success(response?.message);
        getAllProcurementMaterials();
      } else if (response?.status == 422) {
        setErrorMessages(response?.errors);
      } else if (response?.status == 401) {
        toast.error(response?.message);
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

  const handleInput = (event: any) => {
    const value = event.target.value.replace(/\D/g, "");
    event.target.value = value.slice(0, 20);
  };

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "calc(100vh - 190px)",
        overflowY: "auto",
      }}
      className="scrollbar"
    >
      <form className={styles.addmaterials}>
        <div className={styles.formfieldscontainer}>
          <POCMobile
            procurementData={procurementData}
            getProcurementData={getProcurementData}
          />
          <div className={styles.formfieldscontainer}>
            <div className={styles.textAndSupportingText}>
              <div className={styles.textwrapper}>
                <h2 className={styles.heading}>Material Requirement</h2>
                <p className={styles.description}>
                  You can add list of items here based on requirement
                </p>
              </div>
              <Button
                color="primary"
                variant="contained"
                disabled={loading ? true : false}
                onClick={() => addMaterial()}
                className={styles.addMaterialBtnMobile}
              >
                <AddIcon sx={{ fontSize: "1.2rem" }} /> Add
              </Button>
            </div>
            <div className={styles.materialformfields}>
              <div style={{ width: "100%" }}>
                <label className={styles.label}>{"Material Name"}</label>
                <TextField
                  size="small"
                  placeholder="Please enter the material title"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    background: "#fff",
                    borderRadius: "4px",
                    width: "100%",
                    marginTop: "0.4rem",
                  }}
                />
                <ErrorMessages
                  errorMessages={errorMessages}
                  keyname={"name"}
                />
              </div>
              <div className={styles.group}>
                <div className={styles.required}>
                  <Image
                    alt=""
                    src={"/procurement-1.svg"}
                    width={30}
                    height={30}
                  />
                  <div className={styles.row}>
                    <div>
                      <TextField
                        size="small"
                        sx={{
                          width: "100%",
                          background: "#fff",
                        }}
                        placeholder="Required"
                        variant="outlined"
                        value={requiredQty}
                        onInput={handleInput}
                        onChange={(e: any) =>
                          setRequiredQty(e.target.value)
                        }
                      />
                      <ErrorMessages
                        errorMessages={errorMessages}
                        keyname={"required_qty"}
                      />
                    </div>
                    <div>
                      <FormControl
                        variant="outlined"
                        sx={{ width: "100%" }}
                      >
                        <InputLabel color="primary" />
                        <Select
                          sx={{
                            background: "#fff",
                          }}
                          size="small"
                          defaultValue="Litres"
                          value={requiredUnits}
                          onChange={(e: any) =>
                            setRequiredUnits(e.target.value)
                          }
                        >
                          <MenuItem value="Litres">Litres</MenuItem>
                          <MenuItem value="Kilograms">Kilograms</MenuItem>
                        </Select>
                      </FormControl>
                      <ErrorMessages
                        errorMessages={errorMessages}
                        keyname={"required_units"}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.required}>
                  <Image
                    alt=""
                    src={"/approved-1.svg"}
                    width={30}
                    height={30}
                  />
                  <div className={styles.row}>
                    <div>
                      <TextField
                        size="small"
                        sx={{
                          width: "100%",
                          background: "#fff",
                        }}
                        placeholder="Availble"
                        variant="outlined"
                        value={availableQty}
                        onInput={handleInput}
                        onChange={(e: any) => setAvailableQty(e.target.value)}
                      />
                    </div>
                    <div>

                      <FormControl variant="outlined" sx={{ width: "100%" }}>
                        <InputLabel color="primary" />
                        <Select
                          sx={{
                            background: "#fff",
                          }}
                          size="small"
                          defaultValue="Litres"
                          value={requiredUnits}
                          onChange={(e: any) =>
                            setRequiredUnits(e.target.value)
                          }
                        >
                          <MenuItem value="Litres">Litres</MenuItem>
                          <MenuItem value="Kilograms">Kilograms</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className={styles.required}>
                  <div>

                  </div>
                  <ErrorMessages
                    errorMessages={errorMessages}
                    keyname={"available_qty"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <ButtonGroup fillButton="Submit" buttonGroupGap="1rem" /> */}
      </form>
      <div style={{ marginTop: "30px" }}>
        {materials?.length || rejectedMaterials?.length ? (
          <ProcurementDetailsMobile
            materials={materials}
            procurementData={procurementData}
            getAllProcurementMaterials={getAllProcurementMaterials}
            rejectedMaterials={rejectedMaterials}
          />
        ) : (
          ""
        )}
      </div>

      <LoadingComponent loading={loading} />
    </div>
  );
}
export default AddMaterialMobile;