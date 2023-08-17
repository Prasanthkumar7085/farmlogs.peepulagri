import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import styles from "./card.module.css";

type FarmDetailsMiniCardType = {
  /** Style props */
  cardTop?: CSSProperties["top"];
  cardRight?: CSSProperties["right"];
  cardAlignItems?: CSSProperties["alignItems"];
  cardLeft?: CSSProperties["left"];
  vectorIconWidth?: CSSProperties["width"];
  vectorIconHeight?: CSSProperties["height"];
  rectangleDivRight?: CSSProperties["right"];
  rectangleDivBottom?: CSSProperties["bottom"];
  rectangleDivWidth?: CSSProperties["width"];
  rectangleDivHeight?: CSSProperties["height"];
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
}) => {
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
          <div className={styles.farm1}>Farm-1</div>
          <div className={styles.acres}>60 Acres</div>
        </div>
      </div>
      <div className={styles.cardChild} style={rectangleDivStyle} />
    </div>
  );
};

export default FarmDetailsMiniCard;
