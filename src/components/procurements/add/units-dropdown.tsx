import type { NextPage } from "next";
import styles from "./units-dropdown.module.css";

const UnitsDropdown: NextPage = () => {
  return (
    <div className={styles.unitsDropdown}>
      <div className={styles.todo}>
        <div className={styles.kilograms}>Kilograms</div>
      </div>
      <div className={styles.inProgress}>
        <div className={styles.kilograms}>Litres</div>
      </div>
      <div className={styles.inProgress1}>
        <div className={styles.kilograms}>Units</div>
      </div>
      <div className={styles.inProgress2}>
        <div className={styles.kilograms}>Meters</div>
      </div>
      <div className={styles.inProgress3}>
        <div className={styles.kilograms}>Tons</div>
      </div>
      <div className={styles.inProgress4}>
        <div className={styles.kilograms}>Boxes</div>
      </div>
      <div className={styles.inProgress5}>
        <div className={styles.kilograms}>Sets</div>
      </div>
      <div className={styles.inProgress6}>
        <div className={styles.kilograms}>Pieces</div>
      </div>
      <div className={styles.inProgress7}>
        <div className={styles.kilograms}>Acres</div>
      </div>
      <div className={styles.unitsDropdownChild} />
    </div>
  );
};

export default UnitsDropdown;
