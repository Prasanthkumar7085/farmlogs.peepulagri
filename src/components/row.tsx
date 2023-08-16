import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import styles from "./row.module.css";

type RowType = {
  data?: string;
  data1?: string;
  soilPreparation?: string;
  data2?: string;
  man?: string;
  prop?: string;
  women?: string;
  prop1?: string;
  tractor1?: string;
  prop2?: string;
  pesticide1?: string;
  prop3?: string;
  hours?: string;
  hours1?: string;
  eye11?: string;
  showMen?: boolean;
  showWomen?: boolean;
  showTrackor?: boolean;
  showSpray?: boolean;

  /** Style props */
  rowPosition?: CSSProperties["position"];
  rowBackgroundColor?: CSSProperties["backgroundColor"];
  rowJustifyContent?: CSSProperties["justifyContent"];
  rowAlignSelf?: CSSProperties["alignSelf"];
  dataFlex?: CSSProperties["flex"];
  frameDivBackgroundColor?: CSSProperties["backgroundColor"];
  frameDivBorder?: CSSProperties["border"];
  frameDivAlignItems?: CSSProperties["alignItems"];
  soilPreparationColor?: CSSProperties["color"];
  dataColor?: CSSProperties["color"];
  dataBackground?: CSSProperties["background"];
  dataWebkitBackgroundClip?: CSSProperties["webkitBackgroundClip"];
  dataWebkitTextFillColor?: CSSProperties["webkitTextFillColor"];
};

const Row: NextPage<RowType> = ({
  data,
  data1,
  soilPreparation,
  data2,
  man,
  prop,
  women,
  prop1,
  tractor1,
  prop2,
  pesticide1,
  prop3,
  hours,
  hours1,
  eye11,
  showMen,
  showWomen,
  showTrackor,
  showSpray,
  rowPosition,
  rowBackgroundColor,
  rowJustifyContent,
  rowAlignSelf,
  dataFlex,
  frameDivBackgroundColor,
  frameDivBorder,
  frameDivAlignItems,
  soilPreparationColor,
  dataColor,
  dataBackground,
  dataWebkitBackgroundClip,
  dataWebkitTextFillColor,
}) => {
  const rowStyle: CSSProperties = useMemo(() => {
    return {
      position: rowPosition,
      backgroundColor: rowBackgroundColor,
      justifyContent: rowJustifyContent,
      alignSelf: rowAlignSelf,
    };
  }, [rowPosition, rowBackgroundColor, rowJustifyContent, rowAlignSelf]);

  const data1Style: CSSProperties = useMemo(() => {
    return {
      flex: dataFlex,
    };
  }, [dataFlex]);

  const frameDivStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: frameDivBackgroundColor,
      border: frameDivBorder,
      alignItems: frameDivAlignItems,
    };
  }, [frameDivBackgroundColor, frameDivBorder, frameDivAlignItems]);

  const soilPreparationStyle: CSSProperties = useMemo(() => {
    return {
      color: soilPreparationColor,
    };
  }, [soilPreparationColor]);

  const data2Style: CSSProperties = useMemo(() => {
    return {
      color: dataColor,
      background: dataBackground,
      webkitBackgroundClip: dataWebkitBackgroundClip,
      webkitTextFillColor: dataWebkitTextFillColor,
    };
  }, [
    dataColor,
    dataBackground,
    dataWebkitBackgroundClip,
    dataWebkitTextFillColor,
  ]);

  return (
    <div className={styles.row} style={rowStyle}>
      <div className={styles.bodyCell}>
        <div className={styles.data}>{data}</div>
      </div>
      <div className={styles.bodyCell1}>
        <div className={styles.data} style={data1Style}>
          {data1}
        </div>
      </div>
      <div className={styles.bodyCell2}>
        <div className={styles.soilPreparationWrapper} style={frameDivStyle}>
          <div className={styles.data} style={soilPreparationStyle}>
            {soilPreparation}
          </div>
        </div>
      </div>
      <div className={styles.bodyCell3}>
        <div className={styles.data} style={data2Style}>
          {data2}
        </div>
      </div>
      <div className={styles.bodyCell4}>
        {showMen && (
          <div className={styles.men}>
            <img className={styles.manIcon} alt="" src={man} />
            <div className={styles.div}>{prop}</div>
          </div>
        )}
        {showWomen && (
          <div className={styles.women}>
            <img className={styles.manIcon} alt="" src={women} />
            <div className={styles.div}>{prop1}</div>
          </div>
        )}
        {showTrackor && (
          <div className={styles.men}>
            <img className={styles.manIcon} alt="" src={tractor1} />
            <div className={styles.div2}>{prop2}</div>
          </div>
        )}
        {showSpray && (
          <div className={styles.spray}>
            <img className={styles.manIcon} alt="" src={pesticide1} />
            <div className={styles.div}>{prop3}</div>
          </div>
        )}
      </div>
      <div className={styles.bodyCell5}>
        <img
          className={styles.trashXmark1Icon}
          alt=""
          src="/timehalfpast-1-1.svg"
        />
        <div className={styles.data}>{hours}</div>
      </div>
      <div className={styles.bodyCell6}>
        <img
          className={styles.trashXmark1Icon}
          alt=""
          src="/timehalfpast-1-11.svg"
        />
        <div className={styles.data}>{hours1}</div>
      </div>
      <div className={styles.bodyCell7}>
        <img className={styles.trashXmark1Icon} alt="" src={eye11} />
        <img className={styles.trashXmark1Icon} alt="" src="/pencil-2-1.svg" />
        <img
          className={styles.trashXmark1Icon}
          alt=""
          src="/trashxmark-1.svg"
        />
      </div>
    </div>
  );
};

export default Row;
