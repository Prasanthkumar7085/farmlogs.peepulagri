import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import styles from "./body-cell.module.css";


const BodyCell: NextPage<any> = ({
  para = "data",
  bodyCellPosition,
  bodyCellWidth,
  dataColor,
  dataBackground,
  dataWebkitBackgroundClip,
  dataWebkitTextFillColor,
  dataFlex,
}: any) => {
  const bodyCellStyle: CSSProperties = useMemo(() => {
    return {
      position: bodyCellPosition,
      width: bodyCellWidth,
    };
  }, [bodyCellPosition, bodyCellWidth]);

  const dataStyle: CSSProperties = useMemo(() => {
    return {
      color: dataColor,
      background: dataBackground,
      webkitBackgroundClip: dataWebkitBackgroundClip,
      webkitTextFillColor: dataWebkitTextFillColor,
      flex: dataFlex,
    };
  }, [
    dataColor,
    dataBackground,
    dataWebkitBackgroundClip,
    dataWebkitTextFillColor,
    dataFlex,
  ]);

  return (
    <div className={styles.bodyCell} style={bodyCellStyle}>
      <div className={styles.data} style={dataStyle}>
        {para}
      </div>
    </div>
  );
};

export default BodyCell;
