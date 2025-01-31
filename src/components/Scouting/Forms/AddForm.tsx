import AddLocationDialog from "@/components/Core/AddLocationDialog/AddLocationDialog";
import AlertComponent from "@/components/Core/AlertComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { FarmDataType } from "@/types/farmCardTypes";
import AddIcon from "@mui/icons-material/Add";
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import addFarmService from "../../../../lib/services/FarmsService/addFarmService";
import editFarmService from "../../../../lib/services/FarmsService/editFarmService";
import getFarmByIdService from "../../../../lib/services/FarmsService/getFarmByIdService";
import addLocationService from "../../../../lib/services/Locations/addLocationService";
import getAllLocationsService from "../../../../lib/services/Locations/getAllLocationsService";
import styles from "./add-farm-form1.module.css";
import { toast } from "sonner";
const AddFarmForm = () => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const [errorMessages, setErrorMessages] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);
  const [data, setData] = useState<FarmDataType>();
  const [title, setTitle] = useState<string>("");
  const [location, setLocation] = useState<{
    title: string;
    _id: string;
  } | null>();
  const [area, setArea] = useState<string>();
  const [open, setOpen] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [locations, setLocations] = useState<
    Array<{ title: string; _id: string }>
  >([]);
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [hiddenLoading, setHiddenLoading] = useState(false);
  const [settingLocationLoading, setSettingLocationLoading] = useState(false);
  const [addLocationLoading, setAddLocationLoading] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [addLocation, setAddLocation] = useState<any>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const detailsAfterResponse = (response: any) => {
    if (response?.success) {
      setAlertMessage(response?.message);
      setAlertType(true);

      setTimeout(() => {
        router.push(`/farms?location=${response?.data?.location}`);
      }, 1000);
    } else if (response?.status == 422) {
      if (response?.errors) {
        setErrorMessages(response?.errors);
      } else {
        setErrorMessages({ title: response?.message });
      }
    } else {
      setAlertMessage("Failed while saving the Farm Details");
      setAlertType(false);
    }
  };

  const addFarm = async (data: any) => {
    const { location_id, title, area } = data;

    let obj = {
      title: title,
      area: area,
      location_id: location_id ? location_id : "",
    };

    let response = await addFarmService(obj, accessToken);
    detailsAfterResponse(response);
    setLoading(false);

  };
  const edtiFarm = async (obj: any) => {
    let editedData: any = {
      title: data?.title,
      area: data?.area,
      location_id: data?.location_id,
    };

    Object.keys(obj).map((item: string) => {
      editedData[item] = obj[item];
    });
    const response = await editFarmService(
      editedData,
      accessToken,
      router.query.farm_id as string
    );
    detailsAfterResponse(response);
    setLoading(false);
  };

  const onSubmitClick = async (data: any) => {
    setErrorMessages({});
    setLoading(true);

    let obj = {
      title: title,
      location_id: location?._id,
      area: area ? +area : null,
    };

    if (router.query.farm_id) {
      edtiFarm(obj);
    } else {
      addFarm(obj);
    }
  };

  const handleKeyPress = (event: any) => {
    const keyPressed = event.key;
    const allowedCharacters = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
    ];

    if (!allowedCharacters.includes(keyPressed)) {
      event.preventDefault();
    }
  };

  const getFarmDataById = async () => {
    setLoading(true);

    const response: any = await getFarmByIdService(
      router.query.farm_id as string,
      accessToken as string
    );

    if (response.success) {
      setData(response.data);

      setArea(response?.data?.area);
      setTitle(response?.data?.title);
      const locationFromResponse = response?.data?.location_id;
      // const locationObjFromResponse = locationFromResponse.find((item: {name:string,_id:string})=>item.name==locationFromResponse);
      // setLocation(locationObjFromResponse);
      await getLocations(locationFromResponse);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      if (router.query.farm_id) {
        getFarmDataById();
      } else if (router.query.location) {
        getLocations(router.query.location as string);
      }
    }
  }, [router.isReady, accessToken, router.query.location]);

  useEffect(() => {
    setHiddenLoading(true);
    setTimeout(() => {
      setHiddenLoading(false);
    }, 1);
  }, [data]);

  const getLocations = async (newLocation: any) => {
    setOptionsLoading(true);
    try {
      const response = await getAllLocationsService(accessToken);
      if (response?.success) {
        setLocations(response?.data);
        if (newLocation) {
          setSettingLocationLoading(true);
          const newLocationObject = response?.data?.find(
            (item: any) => item?._id == newLocation?._id
          );
          setLocation(newLocationObject);
          setTimeout(() => {
            setSettingLocationLoading(false);
          }, 1);
        }
      }
    } catch (e) {
    } finally {
      setOptionsLoading(false);
    }
  };

  const addInputValue = (e: any, newValue: string) => {
    setNewLocation(newValue.toUpperCase());
  };

  const captureResponseDilog = (value: any) => {
    setErrorMessages([]);
    if (value == false) {
      setAddLocationOpen(false);
      setNewLocation("");
    } else {
      addNewLocation(value);
    }
  };

  const addNewLocation = async (location: string) => {
    setAddLocationLoading(true);

    const response = await addLocationService({ title: location }, accessToken);
    if (response?.success) {
      setAlertMessage(response?.message);
      setAlertType(true);
      setAddLocationOpen(false);
      setAddLocation(response.data);
      getLocations(response?.data);
      setNewLocation("");
    } else if (response?.status == 422) {
      toast.error("Location already exists")
      setAlertMessage(response?.errors?.title);
      setAlertType(false);
    } else {
      setAlertMessage(response?.message);
      setAlertType(false);
    }
    setAddLocationLoading(false);
  };

  return (
    <div>
      <div className={styles.header} id="header">
        <img
          className={styles.iconsiconArrowLeft}
          alt=""
          src="/iconsiconarrowleft.svg"
          onClick={() => router.back()}
        />
        <Typography className={styles.viewFarm}>
          {router?.query?.farm_id ? "Edit Farm" : "Add Farm"}
        </Typography>
        <div className={styles.headericon} id="header-icon"></div>
      </div>
      <form onSubmit={handleSubmit(onSubmitClick)}>
        {!loading ? (
          <div className={styles.addfarmform} id="add-farm">
            <div className={styles.formfields} id="form-fields">
              <div className={styles.farmname} id="farm-name">
                <div className={styles.label}>Title</div>
                <TextField
                  sx={{
                    "& .MuiInputBase-root": {
                      background: "#fff",
                    },
                    "& .MuiInputBase-input": {
                      padding: "11.5px 14px",
                      height: "inherit",
                      fontFamily: "'Inter', sans-serif",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "grey !important",
                    },
                  }}
                  {...register("title")}
                  name="title"
                  fullWidth
                  className={styles.inputfarmname}
                  size="small"
                  placeholder="Farm Name"
                  variant="outlined"
                  error={Boolean(errorMessages?.["title"])}
                  helperText={
                    errorMessages?.["title"] ? errorMessages?.["title"] : ""
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.farmname} id="enter-location">
                <div
                  className={styles.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: "0.5rem",
                    width: "100%",
                  }}
                >
                  <span>Location</span>
                  <span
                    className={styles.addLocationBtn}
                    onClick={() => {
                      setNewLocation("");
                      setAddLocationOpen(true);
                    }}
                  >
                    <AddIcon sx={{ fontSize: "1.2rem" }} /> ADD
                  </span>
                </div>

                {!hiddenLoading && !settingLocationLoading ? (
                  <Autocomplete
                    id="asynchronous-demo"
                    open={open}
                    fullWidth
                    onOpen={() => {
                      getLocations("");
                      setOpen(true);
                    }}
                    onClose={() => {
                      setOpen(false);
                    }}
                    noOptionsText={
                      <div>
                        {"No such location!"}{" "}
                        <span
                          style={{ color: "blue" }}
                          onClick={() => setAddLocationOpen(true)}
                        >
                          Add New?
                        </span>
                      </div>
                    }
                    value={location}
                    isOptionEqualToValue={(option, value) =>
                      option.title === value.title
                    }
                    getOptionLabel={(option: { title: string; _id: string }) =>
                      option.title.toUpperCase()
                    }
                    options={locations}
                    loading={optionsLoading}
                    onInputChange={addInputValue}
                    onChange={(e: any, value: any, reason: any) => {
                      if (reason == "clear") {
                        setLocation(null);
                      }
                      if (value) {
                        setLocation(value);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {optionsLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        {...register("location_id")}
                        className={styles.inputfarmname}
                        name="location_id"
                        size="small"
                        placeholder="Add Location"
                        fullWidth
                        variant="outlined"
                        error={Boolean(errorMessages?.["location_id"])}
                        helperText={
                          errorMessages?.["location_id"]
                            ? errorMessages?.["location_id"]
                            : ""
                        }
                        sx={{
                          "& .MuiInputBase-root": {
                            background: "#fff",
                          },
                          "& .MuiInputBase-input": {
                            padding: "5.5px 14px !important",
                            height: "inherit",
                            fontFamily: "'Inter', sans-serif",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "grey !important",
                          },
                        }}
                      />
                    )}
                  />
                ) : (
                  ""
                )}
              </div>
              <div
                className={styles.farmname}
                id="acres"
                style={{ paddingTop: "1rem" }}
              >
                <div className={styles.label}>Total Land (acres)</div>
                <TextField
                  sx={{
                    "& .MuiInputBase-root": {
                      background: "#fff",
                    },
                    "& .MuiInputBase-input": {
                      padding: "12px 14px",
                      height: "inherit",
                      fontFamily: "'Inter', sans-serif",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "grey !important",
                    },
                  }}
                  {...register("area")}
                  className={styles.inputfarmname}
                  name="area"
                  size="small"
                  placeholder="Acres"
                  fullWidth
                  type={"number"}
                  onWheel={(e: any) => e.target.blur()}
                  variant="outlined"
                  error={Boolean(errorMessages?.["area"])}
                  helperText={
                    errorMessages?.["area"] ? errorMessages?.["area"] : ""
                  }
                  onKeyPress={handleKeyPress}
                  inputProps={{
                    step: "any",
                  }}
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
              <div className={styles.buttons}>
                <Button
                  className={styles.back}
                  name="back"
                  size="medium"
                  variant="outlined"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  className={styles.submit}
                  color="primary"
                  name="submit"
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <LoadingComponent loading={loading} />
        <AlertComponent
          alertMessage={alertMessage}
          alertType={alertType}
          setAlertMessage={setAlertMessage}
          mobile={true}
        />
        <AddLocationDialog
          open={addLocationOpen}
          captureResponseDilog={captureResponseDilog}
          defaultTitle={newLocation}
          errorMessages={errorMessages}
          loading={addLocationLoading}
        />
      </form>
      <LoadingComponent loading={optionsLoading} />
    </div>
  );
};

export default AddFarmForm;
