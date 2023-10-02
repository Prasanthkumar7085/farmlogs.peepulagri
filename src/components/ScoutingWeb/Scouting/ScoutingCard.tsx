import { FunctionComponent, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import styles from "./ScoutingCard.module.css";

const ScoutingCardWeb: FunctionComponent = () => {
  // const navigate = useNavigate();

  // const onViewClick = useCallback(() => {
  //   navigate("/scouting1");
  // }, [navigate]);
  const images = [
    {
      img: '/image11@2x.png',
      title: 'Crop',
    },
    {
      img: '/image12@2x.png',
      title: 'Crop',
    },
    {
      img: '/image13@2x.png',
      title: 'Crop',
    },
    {
      img: '/image14@2x.png',
      title: 'Crop',
    },
    {
      img: '/image9@2x.png',
      title: 'Crop',
    },
    {
      img: '/image10@2x.png',
      title: 'Crop',
    },
  ];

  return (
    <div className={styles.scoutingCard}>
      <div className={styles.imgFlexContainer}>
        {images.map((item) => (
          <div key={item.img} className={styles.eachImgBox}>
            <img
              className={styles.imageIcon}
              src={item.img}
              alt={item.title}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div className={styles.carddetails}>
        <p className={styles.date}>25 Aug 2023 10:30AM</p>
        <div className={styles.buttons}>
          <div className={styles.view}
          //  onClick={onViewClick}
          >
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-view-icon.svg"
            />
          </div>
          <div className={styles.edit}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/edit-farm-icon.svg"
            />
          </div>
          <div className={styles.delete}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-delete-icon.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoutingCardWeb;
