import FarmCard from "./FarmCard";
import Link from "next/link";
import Image from "next/image";
import { FarmDataType } from "@/types/farmCardTypes";
import { useRouter } from "next/router";
import styles from "./FarmCardLayout.module.css";

const FarmCardsLayOut = ({ children, farmsData }: any) => {

    const router = useRouter();

    return (
        <div className={styles.innerWrapper}>
            <div className={styles.cardContainer}>
                {farmsData?.data?.length && farmsData?.data.map((item: FarmDataType) => {
                    console.log(item);

                    return (
                        <div key={item._id} onClick={() => router.push(`/farm/${item._id}/logs`)} style={{ cursor: "pointer" }}>
                                <FarmCard
                                    _id={item?._id}
                                    acresCount={item?.area}
                                    farmName={item?.title}
                                    createAt={item?.createdAt}
                                logCount={item?.logCount}
                            />
                        </div>
                    )
                })}
            </div>
            <div className={styles.FarmDetails}>
                <Image alt="" src='/image-2@2x.png' className="mapImage" width={1000} height={150} style={{ objectFit: "cover", objectPosition: "center" }} />
                {children}
            </div>
        </div>

    )
}

export default FarmCardsLayOut;