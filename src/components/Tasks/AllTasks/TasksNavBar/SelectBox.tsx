import { FunctionComponent } from "react";
import styles from "./SelectBox.module.css";

const SelectBox = ({ onClose}:any) => {
  return (
    <div className={styles.selectBox}>
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <div className={styles.frameWrapper}>
            <div className={styles.checkboxParent}>
              <div className={styles.checkbox}>
                <img
                  className={styles.unselectedIcon}
                  alt=""
                  src="/unselected.svg"
                />
                <div className={styles.farmNorthEastField}>
                  Farm-North East Field
                </div>
              </div>
              <div className={styles.checkbox}>
                <img
                  className={styles.unselectedIcon}
                  alt=""
                  src="/unselected.svg"
                />
                <div className={styles.farmNorthEastField}>Farm-Red Chilli</div>
              </div>
              <div className={styles.checkbox}>
                <img
                  className={styles.unselectedIcon}
                  alt=""
                  src="/unselected.svg"
                />
                <div className={styles.farmNorthEastField}>Farm-1</div>
              </div>
              <div className={styles.checkbox}>
                <img
                  className={styles.unselectedIcon}
                  alt=""
                  src="/unselected.svg"
                />
                <div className={styles.farmNorthEastField}>Farm-North West</div>
              </div>
              <div className={styles.checkbox}>
                <img
                  className={styles.unselectedIcon}
                  alt=""
                  src="/unselected.svg"
                />
                <div className={styles.farmNorthEastField}>Farm-2</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.frameWrapper}>
          <div className={styles.frameWrapper}>
            <div className={styles.checkboxParent}>
              <div className={styles.checkbox}>
                <img
                  className={styles.unselectedIcon}
                  alt=""
                  src="/unselected.svg"
                />
                <div className={styles.farmNorthEastField}>Farm-East Gate</div>
              </div>
              <div className={styles.checkbox}>
                <img
                  className={styles.unselectedIcon}
                  alt=""
                  src="/unselected.svg"
                />
                <div className={styles.farmNorthEastField}>Farm-3</div>
              </div>
              <div className={styles.checkbox}>
                <img
                  className={styles.unselectedIcon}
                  alt=""
                  src="/unselected.svg"
                />
                <div className={styles.farmNorthEastField}>
                  Farm-West Gardens
                </div>
              </div>
              <div className={styles.checkbox}>
                <img
                  className={styles.unselectedIcon}
                  alt=""
                  src="/unselected.svg"
                />
                <div className={styles.farmNorthEastField}>Farm-4</div>
              </div>
              <div className={styles.checkbox}>
                <img
                  className={styles.unselectedIcon}
                  alt=""
                  src="/unselected.svg"
                />
                <div className={styles.farmNorthEastField}>
                  Farm-Green Chillies
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.frameGroup}>
        <div className={styles.resetWrapper}>
          <div className={styles.reset}>Reset</div>
        </div>
        <div className={styles.frameWrapper2}>
          <div className={styles.frameParent1}>
            <div className={styles.resetWrapper}>
              <div className={styles.reset}>Cancel</div>
            </div>
            <div className={styles.applyWrapper}>
              <div className={styles.reset}>Apply</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectBox;
