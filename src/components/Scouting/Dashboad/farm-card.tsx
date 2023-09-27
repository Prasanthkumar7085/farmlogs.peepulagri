import type { NextPage } from "next";
import { useCallback } from "react";
import styles from "./farm-card.module.css";
import Image from "next/image";
import { FarmDataType, PaginationInFarmResponse } from "@/types/farmCardTypes";
import timePipe from "@/pipes/timePipe";
import NoDataComponent from "@/components/Core/NoDataComponent";
import NoFarmDataComponent from "@/components/Core/NoFarmDataComponent";
import { useRouter } from "next/router";

const FarmCard = ({ farmsData, paginationDetails, loading }: { farmsData: Array<FarmDataType>, paginationDetails: PaginationInFarmResponse | undefined, loading: boolean }) => {


  const router = useRouter();

  return (
    <div className={styles.allForms}>

      <div className={styles.allFormsBlock}>
        {farmsData.length ? farmsData.map((item: FarmDataType) => {
          return (
            <div className={styles.farmcard} id="farm-card" key={item._id}>
              <div className={styles.farm} id="farm">
                <div className={styles.farmdetails} id="farm-detalis" onClick={() => router.push(`farms/${item._id}`)}>
                  <div className={styles.duration} id="duration">
                    <div className={styles.aug2023}>{timePipe(item.createdAt, 'DD, MMM YYYY')} - Current</div>
                  </div>
                  <div className={styles.farm1}>
                    {item.title.length > 16 ? item.title.slice(0, 12) + '...' : item.title}
                  </div>
                </div>
                <div className={styles.farmareablock} id="farm-area-block">
                  <div className={styles.farmarea} id="farm-area">
                    <div className={styles.area}>
                      <div className={styles.acres}>{item.area?.toFixed(2)} Acres</div>
                    </div>
                  </div>
                  <div className={styles.viewfarm} id="icon-button-view-farm" onClick={() => router.push(`farms/${item._id}/crops`)}>
                    <img alt="" src="/form-card-arrow-icon.svg" />
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
