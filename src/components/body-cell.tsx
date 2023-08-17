import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import styles from "./body-cell.module.css";

type BodyCellType = {
  para?: string;

  /** Style props */
  bodyCellPosition?: Partial<CSSProperties>;
  bodyCellWidth?: Partial<CSSProperties>;
  dataColor?: Partial<CSSProperties>;
  dataBackground?: Partial<CSSProperties>;
  dataWebkitBackgroundClip?: Partial<CSSProperties>;
  dataWebkitTextFillColor?: Partial<CSSProperties>;
  dataFlex?: Partial<CSSProperties>;
};

const BodyCell: NextPage<BodyCellType> = ({
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
