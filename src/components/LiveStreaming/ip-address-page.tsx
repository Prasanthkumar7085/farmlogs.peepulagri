import { FunctionComponent, useCallback, useState } from "react";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import styles from "./ip-address-page.module.css";
import { useRouter } from "next/router";
import addStreamUrls from "../../../lib/services/StreamingServices/addStreamUrlsService";
import LoadingComponent from "../Core/LoadingComponent";

const IpAddressPage: FunctionComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState<any>();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [camOne, setCameOne] = useState("");
  const [camTwo, setCameTwo] = useState("");
  const [errorMesaages, setErrorMessages] = useState<any>();


  const addConfiguration = async () => {
    setLoading(true);
    setErrorMessages("");
    try {

      const body = {
        "label": label,
        "ip_address": ipAddress,
        "port": port,
        "user_name": userName,
        "password": password,
        "cam_0_url": camOne,
        "cam_1_url": camTwo
      };

      const response = await addStreamUrls(body);

      if (response?.success) {
        console.log(response);


        router.push({
          pathname: "/live-streaming",
          query: { id: response?.data?._id },
        });
      } else if (response?.status == 422) {
        setErrorMessages(response?.errors);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.ipaddresspage}>
      <div className={styles.coontainer}>
        <header className={styles.header}>
          <div className={styles.pageheadingcontainer}>
            <button className={styles.backbutton}
              onClick={() => router.back()}
            >
              <img
                className={styles.arrowLeft1Icon}
                alt=""
                src="/arrowleft-1.svg"
              />
            </button>
            <h2 className={styles.pagename}>Configuration</h2>
          </div>
          <div className={styles.navitems}>
            <div className={styles.camersstatus}>
              <img className={styles.cameraIcon} alt="" src="/camera.svg" />
            </div>
            <div className={styles.settings}
            // onClick={onSettingsClick}
            >
              <img
                className={styles.settingsicon}
                alt=""
                src="/settingsicon.svg"
              />
            </div>
            <div className={styles.camersstatus}>
              <img
                className={styles.settingsicon}
                alt=""
                src="/terminalwindow-1.svg"
              />
            </div>
          </div>
        </header>
        <div className={styles.settingscontainer}>
          <form className={styles.form} onSubmit={(e: any) => e.preventDefault()}>
            <div className={styles.textfields}>
              <div className={styles.devicename}>
                <label className={styles.label}>Device Name</label>
                <TextField
                  className={styles.inputbox}
                  color="primary"
                  variant="outlined"
                  placeholder="Enter Device Name"
                  sx={{ "& .MuiInputBase-root": { height: "44px" } }}
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value)
                    setErrorMessages("");
                  }}
                  error={Boolean(errorMesaages?.label)}
                  helperText={errorMesaages?.label}
                />
              </div>
              <div className={styles.devicename}>
                <label className={styles.label}>IP</label>
                <TextField
                  className={styles.inputbox}
                  color="primary"
                  variant="outlined"
                  placeholder="Enter Ip Address"
                  sx={{ "& .MuiInputBase-root": { height: "44px" } }}
                  value={ipAddress}
                  onChange={(e) => {
                    setIpAddress(e.target.value)
                    setErrorMessages("");
                  }}
                  error={Boolean(errorMesaages?.ip_address)}
                  helperText={errorMesaages?.ip_address}
                />
              </div>
              <div className={styles.devicename}>
                <label className={styles.label}>Port</label>
                <TextField
                  className={styles.inputbox}
                  color="primary"
                  variant="outlined"
                  placeholder="Enter Your Port"
                  sx={{ "& .MuiInputBase-root": { height: "44px" } }}
                  type='number'
                  value={port}
                  onChange={(e) => {
                    setPort(e.target.value)
                    setErrorMessages("");
                  }}
                  error={Boolean(errorMesaages?.port)}
                  helperText={errorMesaages?.port}
                />
              </div>
              <div className={styles.devicename}>
                <label className={styles.label}>Username</label>
                <TextField
                  className={styles.inputbox}
                  color="primary"
                  variant="outlined"
                  placeholder="Enter Username"
                  sx={{ "& .MuiInputBase-root": { height: "44px" } }}
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value)
                    setErrorMessages("");
                  }}
                  error={Boolean(errorMesaages?.user_name)}
                  helperText={errorMesaages?.user_name}
                />
              </div>
              <div className={styles.devicename}>
                <label className={styles.label}>Password</label>
                <TextField
                  className={styles.inputbox}
                  color="primary"
                  variant="outlined"
                  placeholder="Enter Password"
                  type="password"
                  sx={{ "& .MuiInputBase-root": { height: "44px" } }}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrorMessages("");
                  }}
                  error={Boolean(errorMesaages?.password)}
                  helperText={errorMesaages?.password}
                />
              </div>
              <div className={styles.devicename}>
                <label className={styles.label}>Camera 0</label>
                <TextField
                  className={styles.inputbox5}
                  color="primary"
                  variant="outlined"
                  placeholder="Enter URL"
                  sx={{ "& .MuiInputBase-root": { height: "44px" } }}
                  value={camOne}
                  onChange={(e) => {
                    setCameOne(e.target.value)
                    setErrorMessages("");
                  }}
                />
              </div>
              <div className={styles.devicename}>
                <label className={styles.label}>Camera 1</label>
                <TextField
                  className={styles.inputbox5}
                  color="primary"
                  variant="outlined"
                  placeholder="Enter URL"
                  sx={{ "& .MuiInputBase-root": { height: "44px" } }}
                  value={camTwo}
                  onChange={(e) => {
                    setCameTwo(e.target.value)
                    setErrorMessages("");
                  }}
                />
              </div>
            </div>
            <div className={styles.buttonsgroup}>
              {/* <button className={styles.cancelbutton}>
                <p className={styles.action}>Cancel</p>
              </button> */}
              <button className={styles.connectbutton}
                onClick={addConfiguration}
              >
                <p className={styles.action1}>Connect</p>
              </button>
            </div>
          </form>
        </div>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default IpAddressPage;
