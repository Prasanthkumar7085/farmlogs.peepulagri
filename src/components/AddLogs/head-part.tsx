import type { NextPage } from "next";
import styles from "./head-part.module.css";

const HeadPart = ({ data }: any) => {



  return (
    <div className={styles.headPart}>
      <div className={styles.subHeading}>
        <img className={styles.icon} alt="" src="/icon.svg" />
        <h4 className={styles.text}>view Log</h4>
      </div>
      <div className={styles.headerContent}>
        <div className={styles.label}>
          <div className={styles.dropdownText}>{data?.categories[0]}</div>
        </div>
        <div className={styles.content}>
          <h3 className={styles.h3title}>
            {data?.title}
          </h3>
          <p className={styles.pdescription}>
            <span className={styles.identifyingSpecificPests}>
              {data?.description}
            </span>
            {/* <span className={styles.identifyingSpecificPests}>
              Monitoring the effectiveness of treatments and reapplying if
              needed.
            </span> */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeadPart;
