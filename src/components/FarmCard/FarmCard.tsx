import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import styles from "./farm-card.module.css";
import { useRouter } from "next/router";


type FarmCardType = {
  id: number,
  farmShape?: string;
  acresCount?: number;
  farmName?: string;
  totalLogs?: number;
  para?: string;

  /** Style props */
  barWidth?: CSSProperties["width"];
};

const FarmCard: NextPage<FarmCardType> = ({
  id,
  farmShape,
  acresCount,
  farmName,
  totalLogs,
  barWidth,
  para,
}: any) => {
  const barStyle: CSSProperties = useMemo(() => {
    return {
      width: barWidth,
    };
  }, [barWidth]);

  const router = useRouter();

  return (
    <div className={id == router.query.farm_id ? styles.farmcard : ""}>
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
          <span className={styles.para}>Progress</span>
          <div className={styles.progress}>
            <div className={styles.bar} style={barStyle} />
          </div>
        </div>
      </div>
      <div className={styles.activebar} />
    </div>
  );
};

export default FarmCard;
