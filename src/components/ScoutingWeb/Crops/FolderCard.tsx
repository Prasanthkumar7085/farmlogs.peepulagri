import { useCallback } from "react";
import styles from "./FolderCard.module.css";
import { useRouter } from "next/router";
import { CropTypeResponse } from "@/types/cropTypes";
import timePipe from "@/pipes/timePipe";
import { useDispatch } from "react-redux";
import { setCropTitleTemp } from "@/Redux/Modules/Farms";
import { Tooltip } from "@mui/material";

interface pageProps {
    cropsData: Array<CropTypeResponse>;
    loading: boolean;
}
const FolderStructure = ({ cropsData, loading }: pageProps) => {

    const router = useRouter();
    const dispatch = useDispatch();

    const onFolderStructureContainerClick = useCallback((crop: CropTypeResponse) => {
        
        dispatch(setCropTitleTemp(crop?.title));
        router.push(`/farm/${router.query.farm_id}/crops/${crop?._id}/scouting`);
    }, []);

    return (
        <div className={styles.allCropsCardContainer}>
            {cropsData.map((item: CropTypeResponse, index: number) => {
                return (
                  <div
                    key={index}
                    className={styles.folderStructure}
                    onClick={() => onFolderStructureContainerClick(item)}
                  >
                    <div className={styles.folder}>
                      <img
                        className={styles.folderIcon}
                        alt=""
                        src="/folder.svg"
                      />
                      <div className={styles.moreicon}>
                        {/* <MoreVertIcon sx={{ color: "#FFB110", fontSize: "1.2rem !important" }} /> */}
                      </div>
                    </div>
                    <div className={styles.textwrapper}>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Tooltip title={item?.title}>
                          <h6 className={styles.type}>
                            {item?.title
                              ? item?.title?.length > 10
                                ? item?.title?.slice(0, 1).toUpperCase() +
                                  item?.title?.slice(1, 14) +
                                  "..."
                                : item?.title[0].toUpperCase() +
                                  item?.title?.slice(1)
                              : ""}
                          </h6>
                        </Tooltip>
                        {/* <div className={styles.date}>
                          {timePipe(item.createdAt, "DD, MMM YYYY")}
                        </div> */}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <div className={styles.date}>
                          {timePipe(item.createdAt, "DD, MMM YYYY")}
                        </div>
                        <div className={styles.date}>
                          {item.crop_area ? item.crop_area : 0}{" "}
                          {item.crop_area > 1 ? "acres" : "acre"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
            })}
        </div>
    );
};

export default FolderStructure;
