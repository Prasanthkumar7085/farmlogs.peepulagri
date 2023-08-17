import { FarmCardTypes } from "@/types/farmCardTypes";
import FarmCard from "./FarmCard";
import Link from "next/link";
import Image from "next/image";


const FarmCardsLayOut = ({ children }: any) => {

    const data: Array<FarmCardTypes> = [
        { id: 1, farmShape: "/farmshape.svg", acresCount: 100, farmName: 'Farm-1', totalLogs: 193, barWidth: "10%", para: "01-03-2022" },
        { id: 2, farmShape: "/farmshape1.svg", acresCount: 10, farmName: 'Farm-2', totalLogs: 135, barWidth: "10%", para: "01-03-2022" },
        { id: 3, farmShape: "/farmshape2.svg", acresCount: 50, farmName: 'Farm-3', totalLogs: 13, barWidth: "10%", para: "01-03-2022" },
        { id: 4, farmShape: "/farmshape3.svg", acresCount: 40, farmName: 'Farm-4', totalLogs: 64, barWidth: "10%", para: "01-03-2022" },
        { id: 5, farmShape: "/farmshape2.svg", acresCount: 40, farmName: 'Farm-5', totalLogs: 64, barWidth: "10%", para: "01-03-2022" },

    ]
    return (
        <div style={{ display: "flex", gap: "30px", padding: "20px" }}>
            <div style={{ width: "300px", }}>
                {data.map((item: FarmCardTypes) => {
                    return (
                        <div key={item.id}>
                            <Link href="/farm/[farm_id]/logs" as={`/farm/${item.id}/logs`} style={{ textDecoration: "none", color: "#000000" }}>
                                <FarmCard
                                    id={item.id}
                                    farmShape={item.farmShape}
                                    acresCount={item.acresCount}
                                    farmName={item.farmName}
                                    totalLogs={item.totalLogs}
                                    barWidth={item.barWidth}
                                    para={item.para}
                                />
                            </Link>
                        </div>
                    )
                })}
            </div>
            <div>
                <Image alt="" src='/image-2@2x.png' width={1000} height={150} />
                {children}
            </div>
        </div>

    )
}

export default FarmCardsLayOut;