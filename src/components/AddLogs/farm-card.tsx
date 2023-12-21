import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import styles from "./farm-card.module.css";

type FarmCardType = {
  farmShape?: string;
  acresCount?: string;
  farmName?: string;
  totalLogs?: string;
  para?: string;

  /** Style props */
  barWidth?: CSSProperties["width"];
};

const FarmCard: NextPage<FarmCardType> = ({
  farmShape,
  acresCount = "0",
  farmName,
  totalLogs,
  barWidth,
  para,
}) => {
  const barStyle: CSSProperties = useMemo(() => {
    return {
      width: barWidth,
    };
  }, [barWidth]);

  return (
    <a className={styles.farmcard}>
      <picture>
        <div className={styles.farmcarddetails}>
          <img className={styles.farmshapeIcon} alt="" src={farmShape} />
          <div className={styles.title}>
            <h4 className={styles.farmname}>{farmName}</h4>
            <p className={styles.acrescount}>{acresCount}</p>
          </div>
        </div>
        <div className={styles.duration}>
          <img className={styles.calendarIcon} alt="" src="/calendaricon.svg" />
          <div className={styles.para}>{para}</div>
        </div>
        <div className={styles.statsprogress}>
          <div className={styles.logscount}>
            <p className={styles.totalLogs}>{totalLogs}</p>
            <p className={styles.p}>125</p>
          </div>
          <div className={styles.progressbar}>
            <span className={styles.label}>Progress</span>
            <div className={styles.progress}>
              <div className={styles.bar} style={barStyle} />
            </div>
          </div>
        </div>
        <div className={styles.activebar} />
      </picture>
    </a>
  );
};

export default FarmCard;
