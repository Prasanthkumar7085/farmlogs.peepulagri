import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import styles from "./header-cell.module.css";

type HeaderCellType = {
  itemStatus?: string;
  itemActionCode?: string;
  itemIdentifier?: string;
  showFrameDiv?: boolean;

  /** Style props */
  headerCellPosition?: CSSProperties["position"];
  headerCellWidth?: CSSProperties["width"];
  headerCellPadding?: CSSProperties["padding"];
  headerCellFlex?: CSSProperties["flex"];
  statusColor?: CSSProperties["color"];
};

const HeaderCell: NextPage<HeaderCellType> = ({
  itemStatus,
  itemActionCode,
  itemIdentifier,
  showFrameDiv,
  headerCellPosition,
  headerCellWidth,
  headerCellPadding,
  headerCellFlex,
  statusColor,
}) => {
  const headerCellStyle: CSSProperties = useMemo(() => {
    return {
      position: headerCellPosition,
      width: headerCellWidth,
      padding: headerCellPadding,
      flex: headerCellFlex,
    };
  }, [headerCellPosition, headerCellWidth, headerCellPadding, headerCellFlex]);

  const statusStyle: CSSProperties = useMemo(() => {
    return {
      color: statusColor,
    };
  }, [statusColor]);

  return (
    <div className={styles.headerCell} style={headerCellStyle}>
      <div className={styles.status} style={statusStyle}>
        {itemStatus}
      </div>
      {showFrameDiv && (
        <div className={styles.polygonParent}>
          <img className={styles.frameChild} alt="" src={itemActionCode} />
          <img className={styles.frameItem} alt="" src={itemIdentifier} />
        </div>
      )}
    </div>
  );
};

export default HeaderCell;
