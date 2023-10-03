import { useCallback } from "react";
import styles from "./FolderCard.module.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from "next/router";
import { CropTypeResponse } from "@/types/cropTypes";
import timePipe from "@/pipes/timePipe";

interface pageProps{
    cropsData: Array<CropTypeResponse>;
    loading: boolean;
}
const FolderStructure = ({ cropsData,loading}:pageProps) => {

    const router = useRouter();
    
    const onFolderStructureContainerClick = useCallback((cropId: string) => {
        console.log(router.query.farm_id);
        
        router.push(`/farm/${router.query.farm_id}/crops/${cropId}/scouting`);
    }, []);

    return (
        <div className={styles.allCropsCardContainer}>
            {cropsData?.length ? cropsData.map((item:CropTypeResponse,index:number) => {
                return (
                    <div
                        key={index}
                        className={styles.folderStructure}
                        onClick={() => onFolderStructureContainerClick(item._id)}
                    >
                        <div className={styles.foder}>
                            <img className={styles.folderIcon} alt="" src="/folder.svg" />
                            <div className={styles.moreicon}>
                                {/* <MoreVertIcon sx={{ color: "#FFB110", fontSize: "1.2rem !important" }} /> */}
                            </div>
                        </div>
                        <div className={styles.textwrapper}>
                            <h6 className={styles.type}>{item.title ? item.title :""}</h6>
                            <div style={{display:"flex",justifyContent:"space-between",width:"100%"}}>
                                <div className={styles.date}>{timePipe(item.createdAt, 'DD, MMM YYYY')}</div>
                                <div className={styles.date}>{item.crop_area ? item.crop_area : 0} {item.crop_area > 1? 'acres':'acre'}</div>
                            </div>
                        </div>
                    </div>              
                )
            }):!loading?"No Crops for the selected farm":""}
        </div>
    );
};

export default FolderStructure;
