import { useMemo, type CSSProperties } from "react";
import styles from "./farm-card.module.css";
import { useRouter } from "next/router";
import { FarmCardPropsType, FarmCardTypes } from "@/types/farmCardTypes";
import timePipe from "@/pipes/timePipe";
import { LinearProgress } from "@mui/material";


const FarmCard = ({
  _id,
  progress,
  acresCount,
  farmName,
  createAt,
  logCount
}: FarmCardPropsType) => {

  const barStyle: CSSProperties = useMemo(() => {
    return {
      width: 100,
    };
  }, [100]);

  const router = useRouter();

  return (
    <div className={styles.farmcard}>
      <div className={styles.farmcarddetails}>
        <img className={styles.farmshapeIcon} alt="" src={'/farmshape2.svg'} />
        <div className={styles.title}>
          <h4 className={styles.farmname}>{farmName}</h4>
          <p className={styles.acrescount}>{acresCount} acres</p>
        </div>
      </div>
      <div className={styles.duration}>
        <img className={styles.calendarIcon} alt="" src="/calendaricon.svg" />
        <div className={styles.para}>{timePipe(createAt, 'DD-MM-YYYY')} - current</div>
      </div>
      <div className={styles.statsprogress}>
        <div className={styles.logscount}>
          <p className={styles.totalLogs}>Total Logs</p>
          <p className={styles.count}>{logCount}</p>
        </div>
        {/* <div className={styles.progressbar}>
          <span className={styles.para}>Progress</span>
          <div className={styles.progress}>
            <div className={styles.bar} style={barStyle} />
          </div>
        </div> */}
      </div>
      <div className={_id == router.query.farm_id ? styles.activebar : styles.default} />
      <div className={styles.progressbar}>
        <LinearProgress variant="determinate" value={progress} color="success" />
      </div>

    </div>
  );
};

export default FarmCard;
