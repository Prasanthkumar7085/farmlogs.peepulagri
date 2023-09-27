import type { NextPage } from "next";
import { useCallback } from "react";
import styles from "./farm-card.module.css";
import Image from "next/image";
import { useRouter } from "next/router";

const FarmCard: NextPage = () => {
  const router = useRouter();
  const onFarmCardClick = useCallback(() => {
    router.push('/scouting/forms/view')
  }, []);

  return (
    <div className={styles.allFormsBlock}>
      <div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div><div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div><div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div><div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div><div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div><div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div><div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div><div className={styles.farmcard} id="farm-card" onClick={onFarmCardClick}>
        <div className={styles.farm} id="farm">
          <div className={styles.farmdetails} id="farm-detalis">
            <div className={styles.duration} id="duration">
              <div className={styles.aug2023}>25, Aug 2023 - Current</div>
            </div>
            <div className={styles.farm1}>Farm-1</div>
          </div>
          <div className={styles.farmareablock} id="farm-area-block">
            <div className={styles.farmarea} id="farm-area">
              <div className={styles.area}>
                <div className={styles.acres}>20 Acres</div>
              </div>
            </div>
            <div className={styles.viewfarm} id="icon-button-view-farm">
              <img alt="" src="/form-card-arrow-icon.svg" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FarmCard;
