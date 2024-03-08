import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css";
import { useRouter } from "next/router";
import getLiveStreamingService from "../../../lib/services/StreamingServices/getLiveStreamingService";
import ReactPlayer from "react-player";
import stautsLiveStreamingService from "../../../lib/services/StreamingServices/stautsLiveStreamingService";
const Home: FunctionComponent = () => {
  const router = useRouter();
  const id = router.query.id

  // const navigate = useNavigate();

  // const onSettingsClick = useCallback(() => {
  //   navigate("/ipaddresspage");
  // }, [navigate]);

  const [data, setData] = useState<any>();
  const [statusData, setStatusData] = useState<any>();

  const getLiveStream = async () => {
    try {

      let response: any = await getLiveStreamingService(id);


      if (response?.success) {
        setData(response.data)
      }
    } catch (err) {
      console.error(err);
    }

  }
  const statusAPI = async () => {
    try {

      let response: any = await stautsLiveStreamingService();
      if (response?.success) {
        setStatusData(response.data)
      }
    } catch (err) {
      console.error(err);
    }

  }

  useEffect(() => {

    const intervalId = setInterval(statusAPI, 15000);
    return () => clearInterval(intervalId);
  }, [])
  const [count, setCount] = useState(0)
  useEffect(() => {
    setCount((prev: number) => prev + 1)
  }, [])
  useEffect(() => {
    getLiveStream();
    statusAPI();
  }, [])

  return (
    <div className={styles.home}>
      <div className={styles.maincontainer}>
        <div className={styles.headerandcameras}>
          <header className={styles.header}>
            <img className={styles.logoIcon} alt="" src="/logo.svg" />
            <div className={styles.navitems}>
              <div className={styles.camersstatus}>
                <img className={styles.cameraIcon} alt="" src="/camera.svg" />
              </div>
              <div className={styles.settings}
                onClick={() => router.push('/add-stream-urls')}
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
          <div className={styles.cameracontainer}>
            <div className={styles.camera1}>

              <div className={styles.camera11}>
                <div className={styles.indicationscontainer}>
                  <div className={styles.toprow}>
                    <div className={styles.live}>
                      <img
                        className={styles.statusDotIcon}
                        alt=""
                        src="/status-dot.svg"
                      />
                      <p className={styles.text}>LIVE</p>
                    </div>
                    <div className={styles.timerandPlayindicators}>
                      <div className={styles.playpause}>
                        <img
                          className={styles.actionicon}
                          alt=""
                          src="/actionicon.svg"
                        />
                      </div>
                      <div className={styles.timercontainer}>
                        <img
                          className={styles.statusDotIcon}
                          alt=""
                          src="/status-dot.svg"
                        />
                        <p className={styles.time}>00:00</p>
                      </div>
                    </div>
                  </div>
                  <ReactPlayer
                    playing={true}
                    controls
                    url={data?.cam_0_url}
                  />
                  <div className={styles.bottomrow}>
                    <p className={styles.cameranumber}>Camera 1</p>
                    <div className={styles.fullscreenbutton}>
                      <img
                        className={styles.cameraIcon}
                        alt=""
                        src="/fulscreenicon.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.camera1}>

              <div className={styles.camera11}>
                <div className={styles.indicationscontainer}>
                  <div className={styles.toprow}>
                    <div className={styles.live}>
                      <img
                        className={styles.statusDotIcon}
                        alt=""
                        src="/status-dot.svg"
                      />
                      <p className={styles.text}>LIVE</p>
                    </div>
                    <div className={styles.timerandPlayindicators}>
                      <div className={styles.playpause}>
                        <img
                          className={styles.actionicon}
                          alt=""
                          src="/actionicon.svg"
                        />
                      </div>
                      <div className={styles.timercontainer}>
                        <img
                          className={styles.statusDotIcon}
                          alt=""
                          src="/status-dot.svg"
                        />
                        <p className={styles.time}>00:00</p>
                      </div>
                    </div>
                  </div>
                  <ReactPlayer
                    playing={true}
                    controls
                    url={data?.cam_1_url}
                  />
                  <div className={styles.bottomrow}>
                    <p className={styles.cameranumber}>Camera 1</p>
                    <div className={styles.fullscreenbutton}>
                      <img
                        className={styles.cameraIcon}
                        alt=""
                        src="/fulscreenicon.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.moredetailsrow}>
          <div className={styles.dateandlocation}>
            <div className={styles.container}>
              <div className={styles.date}>
                <img className={styles.dateicon} alt="" src="/dateicon.svg" />
                <div className={styles.details}>
                  <label className={styles.lable}>Date and Time</label>
                  <h3 className={styles.date1}>--</h3>
                </div>
              </div>
              <div className={styles.date}>
                <img
                  className={styles.dateicon}
                  alt=""
                  src="/locationicon.svg"
                />
                <div className={styles.details}>
                  <label className={styles.lable}>Location</label>
                  <h3 className={styles.date1}>--</h3>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.camerastatuscontainer}>
            <div className={styles.details2}>
              <h2 className={styles.headinglable}>Camera</h2>
              <div className={styles.statuscontainer}>
                <h2 className={styles.headinglable}>Status :</h2>
                <p className={styles.status}>{statusData?.status_message}</p>
              </div>
            </div>
            <img
              className={styles.botimageIcon}
              alt=""
              src="/botimage@2x.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
