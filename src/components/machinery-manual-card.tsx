import type { NextPage } from "next";
import styles from "./machinery-manual-card.module.css";
const MachineryManualCard: NextPage = () => {
  return (
    <div className={styles.bodyPart}>
      <div className={styles.dataGroup}>
        <div className={styles.eachBlock}>
          <div className={styles.inputWithLabel}>
            <h5 className={styles.label}>Work Type</h5>
            <p className={styles.value}>
              <span>{`Machinery `}</span>
              <span className={styles.span}>{`& `}</span>
              <span className={styles.manual}>Manual</span>
            </p>
          </div>
        </div>
        <div className={styles.eachBlock1}>
          <h5 className={styles.label}>Date</h5>
          <div className={styles.dateRange}>
            <div className={styles.fromDate}>
              <div className={styles.text}>05, Aug 2023</div>
            </div>
            <div className={styles.divider}>-</div>
            <div className={styles.fromDate}>
              <div className={styles.text}>11, Aug 2023</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.dataGroup1}>
        <div className={styles.subTitle}>
          <h4 className={styles.text2}>Resources</h4>
        </div>
        <div className={styles.tableGroup}>
          <div className={styles.tableHead}>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Resources Type</h5>
            </div>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Quantity</h5>
            </div>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Total Hours</h5>
            </div>
          </div>
          <div className={styles.tableRow}>
            <div className={styles.inputCell}>
              <p className={styles.text3}>Man</p>
            </div>
            <div className={styles.inputCell1}>
              <p className={styles.dropdownText}>02</p>
            </div>
            <div className={styles.inputCell2}>
              <p className={styles.dropdownText}>13</p>
            </div>
          </div>
          <div className={styles.tableRow}>
            <div className={styles.inputCell}>
              <p className={styles.text3}>Tractors</p>
            </div>
            <div className={styles.inputCell1}>
              <p className={styles.dropdownText}>02</p>
            </div>
            <div className={styles.inputCell2}>
              <p className={styles.dropdownText}>12</p>
            </div>
          </div>
          <div className={styles.tableRow}>
            <div className={styles.inputCell}>
              <p className={styles.text3}>Grading Machine</p>
            </div>
            <div className={styles.inputCell1}>
              <p className={styles.dropdownText}>01</p>
            </div>
            <div className={styles.inputCell2}>
              <p className={styles.dropdownText}>04</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.dataGroup2}>
        <div className={styles.subTitle}>
          <h4 className={styles.text2}>Additional Information</h4>
        </div>
        <div className={styles.tableGroup1}>
          <div className={styles.tableHead1}>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Pesticide</h5>
            </div>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Quantity</h5>
            </div>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Units</h5>
            </div>
          </div>
          <div className={styles.tableRow3}>
            <div className={styles.inputCell}>
              <p className={styles.text3}>Pyrethrin and spinosad</p>
            </div>
            <div className={styles.inputCell1}>
              <p className={styles.dropdownText}>02</p>
            </div>
            <div className={styles.inputCell2}>
              <p className={styles.dropdownText}>Litres</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.dataGroup3}>
        <div className={styles.subTitle2}>
          <div className={styles.textWrapper}>
            <div className={styles.text8}>Attachments</div>
          </div>
        </div>
        <div className={styles.attachments}>
          <div className={styles.eachFile}>
            <a className={styles.deleteButton}>
              <img
                className={styles.trashXmarkIcon}
                alt=""
                src="/trashxmark.svg"
              />
            </a>
          </div>
          <div className={styles.eachFile1}>
            <a className={styles.deleteButton1}>
              <img
                className={styles.trashXmarkIcon}
                alt=""
                src="/trashxmark1.svg"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineryManualCard;
