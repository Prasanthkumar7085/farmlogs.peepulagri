import type { NextPage } from "next";
import styles from "./dropdownresources1.module.css";

type Dropdownresources1Type = {
  onClose?: () => void;
};

const Dropdownresources1: NextPage<Dropdownresources1Type> = ({ onClose }) => {
  const onContentContainer5Click = () => {
    // Please sync "farms/view-logs" to the project
  };

  return (
    <div className={styles.dropdownresources}>
      <div className={styles.content}>
        <div className={styles.text}>Select Category</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Soil Preparation</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Planting</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Irrigation</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Fertilization</div>
      </div>
      <div className={styles.content5} onClick={onContentContainer5Click}>
        <div className={styles.text}>Pest Management</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Weeding</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Crop Rotation</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Harvesting</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Equipment Management</div>
      </div>
      <div className={styles.content1}>
        <div className={styles.text}>Other</div>
      </div>
    </div>
  );
};

export default Dropdownresources1;
