import {
  TextField,
  Button,
  Dialog,
  CircularProgress,
  Autocomplete,
  LinearProgress,
} from "@mui/material";
import styles from "./new-folder1.module.css";
import { useEffect, useState } from "react";
import SpaIcon from "@mui/icons-material/Spa";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const NewFolderDiloag = ({
  open,
  captureResponseDilog,
  loading,
  defaultTitle,
  errorMessages,
  defaultArea,
}: any) => {
  const router = useRouter();
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [title, setTitle] = useState<string | null>(null);
  const [area, setArea] = useState("");
  const [crop, setcrop] = useState([]);

  const [optionsLoading, setOptionsLoading] = useState(false);

  const [defaultValue, setDefaultValue] = useState<any>(null);

  useEffect(() => {
    setArea(defaultArea);
    dropDownCrops(defaultTitle);
  }, [open]);

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

  const dropDownCrops = async (defaultTitle: string) => {
    setOptionsLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/crops`;
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
      if (defaultTitle) {
        let obj = responseData?.data.find((e: any) => e.name == defaultTitle);
        setDefaultValue(obj);
        setTitle(obj.name);
      }
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
    captureResponseDilog(obj);
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          width: "90%",
          margin: "0",
          minWidth: "280px",
          maxWidth: "320px",
        },
      }}
    >
      <div className={styles.newfolder}>
        <div className={styles.frame}>
          <h3 className={styles.newFolder}>
            <SpaIcon />
            <span>{defaultTitle ? `Rename Crop` : `New Crop`}</span>
          </h3>

          <div style={{ textAlign: "left", width: "100%" }}>
            <h4 style={{ margin: "0", paddingBlock: "0.5rem" }}>
              {"Title"}
              <strong style={{ color: "rgb(228 12 15)" }}>*</strong>
            </h4>
          </div>
          <Autocomplete
            options={crop?.length ? crop : []}
            value={defaultValue}
            onChange={(_, newValue: any) => {
              setTitle(newValue?.name);
              setDefaultValue(newValue);
            }}
            getOptionLabel={(e) => e.name}
            renderInput={(params) => (
              <TextField
                {...params}
                className={styles.input}
                color="primary"
                size="small"
                placeholder="Enter folder title here"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "8px !important",
                  },
                }}
                error={errorMessages ? errorMessages["title"] : ""}
                helperText={errorMessages ? errorMessages["title"] : ""}
              />
            )}
          />
          {optionsLoading ? <LinearProgress sx={{ height: "2px" }} /> : ""}
        </div>

        <div className={styles.frame}>
          <div style={{ textAlign: "left", width: "100%" }}>
            <h4 style={{ margin: "0", paddingBlock: "0.5rem" }}>
              {"Crop Area"}
              <strong style={{ color: "rgb(228 12 15)" }}>*</strong>
            </h4>
          </div>
          <TextField
            sx={{
              "& .MuiInputBase-root": {
                background: "#fff",
              },
            }}
            className={styles.input}
            name="area"
            size="small"
            placeholder="Enter total area"
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
            onChange={(e) => setArea(e.target.value)}
            InputProps={{ style: { appearance: "none" } }}
            onKeyDown={(e: any) => {
              if (e.key == "Enter") callData();
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
              captureResponseDilog(false);
              setTitle(null);
              setArea("");
            }}
          >
            Cancel
          </Button>
          <Button
            className={styles.buttoncreatefolder}
            color="primary"
            size="small"
            variant="contained"
            fullWidth
            onClick={() => callData()}
            disabled={optionsLoading || loading}
          >
            {loading ? (
              <CircularProgress size="1.5rem" sx={{ color: "white" }} />
            ) : defaultTitle ? (
              "Update Crop"
            ) : (
              "Create Crop"
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default NewFolderDiloag;
