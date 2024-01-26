import { useCallback } from "react";
import styles from "./crop-card.module.css";
import { useRouter } from "next/router";
import { CropTypeResponse } from "@/types/cropTypes";
import timePipe from "@/pipes/timePipe";
import { useDispatch } from "react-redux";
import { setCropTitleTemp } from "@/Redux/Modules/Farms";
import { Avatar, Tooltip } from "@mui/material";

interface pageProps {
  cropsData: Array<CropTypeResponse>;
  loading: boolean;
}
const FolderStructure = ({ cropsData, loading }: pageProps) => {

  const router = useRouter();
  const dispatch = useDispatch();

  const onFolderStructureContainerClick = useCallback((crop: CropTypeResponse) => {

    dispatch(setCropTitleTemp(crop?.title));
    router.push(`/scouts?farm_id=${router.query.farm_id}&crop_id=${crop?._id}`);
  }, []);

  return (
    <div style={{ display: "flex", gap: "1.9rem" }}>
      {cropsData.map((item: CropTypeResponse, index: number) => {
        return (
          // <div
          //   key={index}
          //   className={styles.folderStructure}
          //   onClick={() => onFolderStructureContainerClick(item)}
          // >
          //   <div className={styles.folder}>
          //     <Avatar
          //       sx={{ bgcolor: "#E6F5EB", color: "#05A155 !important", fontSize: "1.2rem", width: "30%", height: '70%' }}
          //       className={styles.avatarImage}
          //       variant="square"
          //     >
          //       {item?.title.toUpperCase().slice(0, 1)}
          //     </Avatar>
          //     <div className={styles.moreicon}>
          //       <img
          //         className={styles.avatharImg}
          //         alt=""
          //         src={item?.url ? item?.url : "/mobileIcons/crops/No_Image.svg"}
          //         width={"56px"}
          //         height={"56px"}
          //       />
          //     </div>
          //   </div>
          //   <div className={styles.textwrapper}>
          //     <div
          //       style={{
          //         display: "flex",
          //         width: "100%",
          //         justifyContent: "space-between",
          //         alignItems: "center",
          //       }}
          //     >
          //       <Tooltip title={item?.title}>
          //         <h6 className={styles.type}>
          //           {item?.title
          //             ? item?.title?.length > 10
          //               ? item?.title?.slice(0, 1).toUpperCase() +
          //               item?.title?.slice(1, 14) +
          //               "..."
          //               : item?.title[0].toUpperCase() +
          //               item?.title?.slice(1)
          //             : ""}
          //         </h6>
          //       </Tooltip>

          //     </div>
          //     <div
          //       style={{
          //         display: "flex",
          //         justifyContent: "space-between",
          //         width: "100%",
          //       }}
          //     >
          //       <div className={styles.date}>
          //         {timePipe(item.createdAt, "DD, MMM YYYY")}
          //       </div>

          //       <div className={styles.date}>

          //         {item.area ? item.area : 0}{" "}
          //         {item.area > 1 ? "acres" : "acre"}
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <div className={styles.cropCard} key={index}
            onClick={() => onFolderStructureContainerClick(item)} >

            <img className={styles.imageIcon} alt="" src={item?.url ? item?.url : "/mobileIcons/crops/No_Image.svg"} />
            <div className={styles.detailscontainer}>
              <div className={styles.cropnamecontainer}>
                <div className={styles.profile}>
                  <h1 className={styles.h}>{item?.title.toUpperCase().slice(0, 1)}</h1>
                </div>
                <Tooltip title={item?.title}>

                  <p className={styles.cropName}>

                    {item?.title
                      ? item?.title?.length > 10
                        ? item?.title?.slice(0, 1).toUpperCase() +
                        item?.title?.slice(1, 14) +
                        "..."
                        : item?.title[0].toUpperCase() +
                        item?.title?.slice(1)
                      : ""}
                  </p>
                </Tooltip>
              </div>
              <div className={styles.dateandacres}>
                <div className={styles.date}>
                  <img
                    className={styles.calendarBlank1Icon}
                    alt=""
                    src="/calendarblank-1.svg"
                  />
                  <p className={styles.date1}>{timePipe(item.createdAt, "DD, MMM YYYY hh:mm A")}</p>
                </div>
                <p className={styles.acres}>
                  {item.area ? item.area : 0}{" "}
                  {item.area > 1 ? "acres" : "acre"}</p>
              </div>
            </div>
            {/* <div className={styles.imagescount}>
                <p className={styles.p}>325</p>
              </div> */}
          </div>
        );
      })}
    </div>
  );
};

export default FolderStructure;
