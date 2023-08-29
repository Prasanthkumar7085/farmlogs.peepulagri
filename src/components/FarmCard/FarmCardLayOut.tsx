import FarmCard from "./FarmCard";
import Link from "next/link";
import Image from "next/image";
import { FarmDataType } from "@/types/farmCardTypes";


const FarmCardsLayOut = ({ children, farmsData }: any) => {

    return (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "30px", padding: "20px" }}>
            <div style={{ height: "calc(100vh - 1rem)", display: "flex", gap: "1rem", flexDirection: "column", width: "320px", }}>
                {farmsData?.data?.length && farmsData?.data.map((item: FarmDataType) => {
                    return (
                        <div key={item._id}>
                            <Link href="/farm/[farm_id]/logs" as={`/farm/${item._id}/logs`} style={{ textDecoration: "none", color: "#000000" }}>
                                <FarmCard
                                    _id={item?._id}
                                    acresCount={item?.area}
                                    farmName={item?.title}
                                    createAt={item?.createdAt}
                                />
                            </Link>
                        </div>
                    )
                })}
            </div>
            <div className="FarmDetails">
                <Image alt="" src='/image-2@2x.png' className="mapImage" width={1000} height={150} style={{ objectFit: "cover", objectPosition: "center" }} />
                {children}
            </div>
        </div>

    )
}

export default FarmCardsLayOut;