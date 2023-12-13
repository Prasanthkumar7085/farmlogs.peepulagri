import {
  TextField,
  Button,
  Dialog,
  CircularProgress,
  Autocomplete,
  LinearProgress,
  Typography,
} from "@mui/material";
import styles from "./new-folder1.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
import AlertComponent from "../AlertComponent";
import updateCropService from "../../../../lib/services/CropServices/updateCropService";
import LoadingComponent from "../LoadingComponent";

const NewFolderDiloag = ({
  open,
  captureResponseDilog,
  loading,
  defaultTitle,
  // errorMessages,
  defaultArea,
  itemDetails
}: any) => {

  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const crop_id: any = router.query.crop_id
  const [title, setTitle] = useState<string | null>(null);
  const [area, setArea] = useState<any>();
  const [crop, setcrop] = useState([]);
  const [cropDetails, setCropDetails] = useState<any>();
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [loadingForAdd, setLoadingForAdd] = useState<any>();
  const [errorMessages, setErrorMessages] = useState<any>();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(false);

  const [defaultValue, setDefaultValue] = useState<any>(null);
  const [, , removeCookie] = useCookies(["userType"]);
  const [, , loggedIn] = useCookies(["loggedIn"]);

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

  useEffect(() => {
    // setArea(defaultArea);
    dropDownCrops();
    if (router.isReady && crop_id) {
      singleCrop();
    }
  }, [open, router.isReady]);

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
  //create crop api call
  const createCrop = async () => {
    setLoadingForAdd(true);
    let obj = {
      farm_id: router.query.farm_id,
      title: title ? title?.trim() : "",
      area: + area,
    };
    let options = {
      method: "POST",
      body: JSON.stringify(obj),
      headers: new Headers({
        "content-type": "application/json",
        authorization: accessToken,
      }),
    };
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/crops`,
        options
      );
      let responseData = await response.json();
      if (responseData.success) {
        setAlertMessage(responseData.message);
        setAlertType(true);
        router.back();
      } else if (responseData?.status == 422) {
        setErrorMessages(responseData?.errors);
      } else if (responseData?.statusCode == 403) {
        await logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingForAdd(false);
    }
  };

  const editCrop = async () => {
    let obj = {
      farm_id: router.query.farm_id,
      title: title ? title?.trim() : "",
      area: + area,
    };
    setLoadingForAdd(true);
    const response = await updateCropService(
      crop_id,
      obj,
      accessToken
    );
    if (response?.success) {
      setAlertMessage(response?.message);
      setAlertType(true)
      router.back()

    } else if (response?.status == 422) {
      setErrorMessages(response?.errors);
    } else if (response?.statusCode == 403) {
      await logout();
    } else {
      setAlertMessage(response?.message);
      setAlertType(false);
    }
    setLoadingForAdd(false);
  };

  const dropDownCrops = async () => {
    setOptionsLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/farms/${router.query.farm_id}/pending/crop-names`;
      // if (defaultTitle) {
      //   url = `${process.env.NEXT_PUBLIC_API_URL}/crops`;
      // }
      const options = {
        method: "GET",
        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
      };
      const response: any = await fetch(url, options);
      const responseData = await response.json();

      setcrop(responseData.data);
      // if (defaultTitle) {
      //   let obj = responseData?.data.find((e: any) => e.name == defaultTitle);
      //   setDefaultValue(obj);
      //   // setTitle(obj.name);
      // }
    } catch (err: any) {
      console.error(err);
    } finally {
      setOptionsLoading(false);
    }
  };

  const singleCrop = async () => {
    setOptionsLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/crops/${router.query.crop_id}`;

      const options = {
        method: "GET",
        headers: new Headers({
          "content-type": "application/json",
          authorization: accessToken,
        }),
      };
      const response: any = await fetch(url, options);
      const responseData = await response.json();
      setDefaultValue(responseData.data);
      setTitle(responseData.data.title);
      setCropDetails(responseData.data);
      setArea(responseData.data.area);
    } catch (err: any) {
      console.error(err);
    } finally {
      setOptionsLoading(false);
    }
  };

  const callData = () => {
    let obj = {
      title: title ? title : "",
      crop_area: area ? +area : null,
    };
  };

  return (
    <div>
      {crop_id ? (
        <div className={styles.header} id="header" >
          <img
            className={styles.iconsiconArrowLeft}
            alt=""
            src="/iconsiconarrowleft.svg"
            onClick={() => router.back()}

          />
          <Typography className={styles.viewFarm}>Edit Crop</Typography>
          <div className={styles.headericon} id="header-icon">
          </div>
        </div>
      ) : (
        <div className={styles.header} id="header" >
          <img
            className={styles.iconsiconArrowLeft}
            alt=""
            src="/iconsiconarrowleft.svg"
            onClick={() => router.back()}

          />
          <Typography className={styles.viewFarm}>Add Crop</Typography>
          <div className={styles.headericon} id="header-icon">
          </div>
        </div>
      )}

      <div className={styles.newfolder}>
        <div className={styles.frame}>
          <div style={{ textAlign: "left", width: "100%" }}>
            <h4 style={{ margin: "0", paddingBlock: "0.5rem" }}>
              {"Title"}
            </h4>
          </div>
          <Autocomplete
            options={crop?.length ? crop : []}
            value={defaultValue}
            onChange={(_, newValue: any) => {
              setTitle(newValue?.title || newValue?.name);
              setDefaultValue(newValue);
              setErrorMessages('')
            }}
            getOptionLabel={(e) => e.title || e.name}
            renderInput={(params) => (
              <TextField
                {...params}
                className={styles.input}
                color="primary"
                size="small"
                placeholder="Select Crop"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "8px !important",
                    borderColor: "grey !important"

                  },
                  "& .MuiInputBase-root": {
                    background: "#fff",
                    borderRadius: "8px !important",
                    paddingBlock: "10px !important"

                  },
                }}
                error={errorMessages ? errorMessages["title"] : ""}
                helperText={errorMessages ? errorMessages["title"] : ""}
              />
            )}
          />
          {optionsLoading ? <LinearProgress sx={{ height: "2px" }} /> : ""}
        </div>

        <div className={styles.frame} style={{ marginTop: "1.5rem" }}>
          <div style={{ textAlign: "left", width: "100%" }}>
            <h4 style={{ margin: "0", paddingBlock: "0.5rem" }}>
              {"Area"}
            </h4>
          </div>
          <TextField
            sx={{
              "& .MuiInputBase-root": {
                background: "#fff",
                paddingBlock: "5.5px !important",
                borderRadius: "8px !important",
                color: "#000",
                fontFamily: "'Inter', sans-serif"


              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px !important",
                borderColor: "grey !important",
                color: "#000",
                fontFamily: "'Inter', sans-serif"

              },
            }}
            className={styles.input}
            name="area"
            size="small"
            placeholder="Enter area"
            fullWidth
            type={"number"}
            onWheel={(e: any) => e.target.blur()}
            variant="outlined"
            error={Boolean(
              errorMessages?.["area"] || errorMessages?.["crop_area"]
            )}
            helperText={
              errorMessages?.["area"]
                ? errorMessages?.["area"]
                : errorMessages?.["crop_area"]
            }
            onKeyPress={handleKeyPress}
            inputProps={{
              step: "any",
            }}
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              setErrorMessages('')
            }}
            InputProps={{ style: { appearance: "none" } }}
            onKeyDown={(e: any) => {
              if (e.key == "Enter") createCrop();
            }}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            className={styles.buttoncancelfolder}
            color="primary"
            size="small"
            variant="outlined"
            onClick={() => {
              router.back()
            }}
          >
            Cancel
          </Button>
          {crop_id ? (
            <Button
              className={styles.buttoncreatefolder}
              color="primary"
              size="small"
              variant="contained"
              fullWidth
              onClick={editCrop}
              disabled={optionsLoading || loadingForAdd}
            >
              Submit
            </Button>
          ) : (
            <Button
              className={styles.buttoncreatefolder}
              color="primary"
              size="small"
              variant="contained"
              fullWidth
              onClick={createCrop}
              disabled={optionsLoading || loadingForAdd}
            >
              Submit
            </Button>
          )}

          <AlertComponent
            alertMessage={alertMessage}
            alertType={alertType}
            setAlertMessage={setAlertMessage}
            mobile={true}
          />
          <LoadingComponent loading={loadingForAdd} />
        </div>
      </div>
    </div>
  );
};

export default NewFolderDiloag;
