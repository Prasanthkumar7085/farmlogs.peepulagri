import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import styles from "./card.module.css";


import { setSingleFarm } from "@/Redux/Modules/Farms";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

type FarmDetailsMiniCardType = {
  /** Style props */
  cardTop?: Partial<CSSProperties>;
  cardRight?: Partial<CSSProperties>;
  cardAlignItems?: Partial<CSSProperties>;
  cardLeft?: Partial<CSSProperties>;
  vectorIconWidth?: Partial<CSSProperties>;
  vectorIconHeight?: Partial<CSSProperties>;
  rectangleDivRight?: Partial<CSSProperties>;
  rectangleDivBottom?: Partial<CSSProperties>;
  rectangleDivWidth?: Partial<CSSProperties>;
  rectangleDivHeight?: Partial<CSSProperties>;
};

const FarmDetailsMiniCard: NextPage<FarmDetailsMiniCardType> = ({
  cardTop,
  cardRight,
  cardAlignItems,
  cardLeft,
  vectorIconWidth,
  vectorIconHeight,
  rectangleDivRight,
  rectangleDivBottom,
  rectangleDivWidth,
  rectangleDivHeight,
}: any) => {

  const cardStyle: CSSProperties = useMemo(() => {
    return {
      top: cardTop,
      right: cardRight,
      alignItems: cardAlignItems,
      left: cardLeft,
    };
  }, [cardTop, cardRight, cardAlignItems, cardLeft]);


  const vectorIconStyle: CSSProperties = useMemo(() => {
    return {
      width: vectorIconWidth,
      height: vectorIconHeight,
    };
  }, [vectorIconWidth, vectorIconHeight]);

  const rectangleDivStyle: CSSProperties = useMemo(() => {
    return {
      right: rectangleDivRight,
      bottom: rectangleDivBottom,
      width: rectangleDivWidth,
      height: rectangleDivHeight,
    };
  }, [
    rectangleDivRight,
    rectangleDivBottom,
    rectangleDivWidth,
    rectangleDivHeight,
  ]);


  const router = useRouter();
  const dispatch = useDispatch();

  const farmDetails = useSelector((state: any) => state.farms?.singleFarm);


  useEffect(() => {

    if (router.query?.farm_id && router.isReady) {
      dispatch(setSingleFarm(router?.query?.farm_id))
    }

  }, [router.query?.farm_id, router.isReady]);

  return (
    <div className={styles.card} style={cardStyle}>
      <div className={styles.vectorParent}>
        <img
          className={styles.frameChild}
          alt=""
          src="/vector-13.svg"
          style={vectorIconStyle}
        />
        <div className={styles.farm1Parent}>
          <div className={styles.farm1}>
            {farmDetails?.title ? (farmDetails?.title?.length > 16 ?
              (farmDetails?.title?.slice(0, 1).toUpperCase() +
                farmDetails?.title?.slice(1, 10) + '...') :
              farmDetails?.title[0].toUpperCase() + farmDetails?.title?.slice(1,)) : ""}
          </div>
          <div className={styles.acres}>{farmDetails?.area} Acres</div>
        </div>
      </div>
      <div className={styles.cardChild} style={rectangleDivStyle} />
    </div>
  );
};

export default FarmDetailsMiniCard;
