
import styles from "./head-part.module.css";
import ButtonComponent from "../Core/ButtonComponent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/router";
import { Icon } from "@mui/material";


const HeadPart = ({ data }: any) => {

  const router = useRouter();

  return (
    <div className={styles.headPart}>
      <div className={styles.subHeading}>
        <ButtonComponent
          direction={false}
          title='Back'
          icon={<Icon>arrow_back_sharp</Icon>}
          onClick={() => router.back()}
        />
        <h4 className={styles.text}>view Log</h4>
      </div>
      <div className={styles.headerContent}>
        <div className={styles.label}>
          <div className={styles.dropdownText}>{data?.categories[0]}</div>
        </div>
        <div className={styles.content}>
          <h3 className={styles.h3title}>
            {data?.title}
          </h3>
          <p className={styles.pdescription}>
            <span className={styles.identifyingSpecificPests}>
              {data?.description}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeadPart;
