import Image from "next/image";
import styles from "./vendorDetails.module.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
const RemarksBlock = ({ procurementData }: any) => {
  return (
    <section className={styles.vendordetails}>
      <div className={styles.titlevendor}>
        <FormatListBulletedIcon sx={{ fontSize: "1.2rem" }} />
        <h2 className={styles.title}>Remarks</h2>
      </div>
      <div className={styles.detailscontainer}>
        <span className={styles.superChilliVendors}>
          {procurementData?.remarks ? procurementData?.remarks : "----"}
        </span>
      </div>
    </section>
  );
};
export default RemarksBlock;
