import type { NextPage } from "next";
import styles from "./description-container.module.css";

const DescriptionContainer = ({ description }: any) => {

  return (
    <div className={styles.descriptioncontainer}>
      <label className={styles.description}>Description</label>
      <p className={styles.preparingLandFor}>
        {description}
      </p>
    </div>
  );
};

export default DescriptionContainer;
