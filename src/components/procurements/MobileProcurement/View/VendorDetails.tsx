import type { NextPage } from "next";
import styles from "./vendorDetails.module.css";

const VendorDetails = ({ procurementData,
    materials }: any) => {
    return (
        <section className={styles.vendordetails}>
            <div className={styles.titlevendor}>
                <img className={styles.moneyicon} alt="" src="/component-29.svg" />
                <h2 className={styles.title}>Vendor Details</h2>
            </div>
            <div className={styles.detailscontainer}>
                <div className={styles.detailscontainer} >

                    <p className={styles.details} >
                        <span className={styles.superChilliVendors}>
                            {materials[0]?.vendor ? materials[0]?.vendor : "----"}
                        </span>
                        <span className={styles.superChilliVendors}>
                        </span>
                        <span className={styles.superChilliVendors}></span>
                    </p>
                </div>

            </div>
        </section>
    );
};

export default VendorDetails;
