import type { NextPage } from "next";
import styles from "./dropdownresources-type.module.css";

type DropdownresourcesTypeType = {
  onClose?: () => void;
};

const DropdownresourcesType: NextPage<DropdownresourcesTypeType> = ({
  onClose,
}) => {
  return (
    <div className={styles.dropdownresourcesType}>
      <div className={styles.content}>
        <div className={styles.text}>Select Resources Type</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Cultivation Tools</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Tractor</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Irrigation Equipment</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Men</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Mulching Machines</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Seeders or Planters</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Sprayers</div>
      </div>
    </div>
  );
};

export default DropdownresourcesType;
