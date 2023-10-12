import styles from "./farm-card.module.css";
import { FarmDataType } from "@/types/farmCardTypes";
import timePipe from "@/pipes/timePipe";
import { useRouter } from "next/router";
// import ImageComponent from "../../../components/Core/ImageComponent";
import SettingsIcon from '@mui/icons-material/Settings';
interface pagePropsType {
  farmsData: Array<FarmDataType>;
}
const FarmCard = ({ farmsData }: pagePropsType) => {
  const router = useRouter();


  let colorsArray = ["#C71585", "#7B68EE", "#FF8C00", " #008080", "#2E8B57", "#4682B4", "#000080", "#3D3D5B", " #CC0044", "#BA55D3"
    , "#663399", "#8B0000", "#FF4500", "#DA0E0E", "#00CED1", "#4169E1", " #A52A2A", "#2D1E2F", "#714E47", "#C65B7C"
    , "#A04662", "#FE654F", " #5F6A89", "#067BBD"]



  return (
    <div className={styles.allForms}>

      <div className={styles.allFormsBlock}>
        {farmsData.length ? farmsData.map((item: FarmDataType, index: number) => {
          const colorIndex = index % colorsArray.length;

          return (
            <div className={styles.farmcard} id="farm-card" key={item._id} >
              <div className={styles.farm} id="farm">
                <div className={styles.farmdetails} id="farm-detalis" onClick={() => router.push(`farms/${item._id}/crops`)}>
                  <div className={styles.duration} id="duration">
                    <div className={styles.aug2023}>{timePipe(item.createdAt, 'DD, MMM YYYY')} - Current</div>
                  </div>
                  <div className={styles.farm1} style={{ color: colorsArray[colorIndex] }}>
                    {item.title.length > 16 ?

                      (item.title.slice(0, 1).toUpperCase() +
                        item.title.slice(1, 12) + '...') :

                      item.title[0].toUpperCase() + item.title.slice(1,)}
                  </div>

                  {/* <div className={styles.location}>
                  {!loading && location && location == 'All' ?<div className={styles.locationArea}>
                        {item?.location.length > 13 ? item?.location.slice(0, 10) + '...' : item?.location}
                    </div>:""}
                  </div> */}
                </div>
                <div className={styles.farmareablock} id="farm-area-block">
                  <div className={styles.farmarea} id="farm-area" onClick={() => router.push(`farms/${item._id}/crops`)}>
                    <div className={styles.area}>
                      <div className={styles.acres}>{item?.area ? Math.floor(item?.area * 100) / 100 : ""} Acres</div>
                    </div>
                  </div>
                  <div className={styles.viewfarm} id="icon-button-view-farm" onClick={() => router.push(`farms/${item._id}`)}>
                    <SettingsIcon sx={{ color: "#c1c1c1" }} />
                  </div>
                </div>
              </div>
            </div>
          )
        }) :
          ""
        }
      </div>
    </div>
  );
};

export default FarmCard;
