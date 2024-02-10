import type { NextPage } from "next";
import styles from "./vendorDetails.module.css";
import Image from "next/image";

const VendorDetails = ({ procurementData,
    materials }: any) => {


    return (
        <section className={styles.vendordetails}>
            <div className={styles.titlevendor}>
                <Image alt="" src="/component-29.svg" height={18} width={18} />
                <h2 className={styles.title}>Vendor Details</h2>
            </div>
            <div className={styles.detailscontainer}>
                <span className={styles.superChilliVendors} style={{ whiteSpace: "pre-line" }}>
                    {materials[0]?.vendor ? materials[0]?.vendor : "----"}
                </span>
            </div>
        </section>
    );
};

export default VendorDetails;
