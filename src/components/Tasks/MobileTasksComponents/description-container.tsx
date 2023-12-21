import type { NextPage } from "next";
import styles from "./description-container.module.css";

const DescriptionContainer: NextPage = () => {
  return (
    <div className={styles.descriptioncontainer}>
      <label className={styles.description}>Description</label>
      <p className={styles.preparingLandFor}>
        Preparing land for chili farming is a comprehensive process involving
        various critical tasks. It commences with a thorough soil assessment,
        testing pH levels and nutrient composition, followed by necessary
        amendments such as adding organic matter or fertilizers to enhance soil
        fertility. Clearing debris, tilling or plowing, and leveling the land
        create an optimal groundwork, while setting up irrigation systems and
        applying mulch ensures consistent moisture retention and temperature
        regulation.
      </p>
    </div>
  );
};

export default DescriptionContainer;
