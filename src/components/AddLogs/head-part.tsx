
import styles from "./head-part.module.css";
import ButtonComponent from "../Core/ButtonComponent";
import { useRouter } from "next/router";
import { Chip, Icon } from "@mui/material";


const HeadPart = ({ data }: any) => {

  const router = useRouter();

  const getLabel = (item: string) => {
    const categoryOptions = [
      { title: 'Soil Preparation', value: "soil_preparation" },
      { title: 'Planting', value: "plainting" },
      { title: 'Irrigation', value: "irrigation" },
      { title: 'Fertilization', value: "fertilization" },
      { title: 'Pest Management', value: "pest_management" },
      { title: 'Weeding', value: "weeding" },
      { title: 'Crop Rotation', value: "crop_rotation" },
      { title: 'Harvesting', value: "harvesting" },
      { title: 'Equipment Management', value: "equipment_management" },
      { title: 'Other', value: "other" },
    ];

    return (categoryOptions.find((categoryItem: { title: string, value: string }) => categoryItem.value == item))?.title
  }
  const getCategories = (categories: Array<string>) => {

    return categories && categories.length && categories.map((item: string) => {
      return getLabel(item)
    }).join(', ')


  }

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
          <div className={styles.dropdownText}>{getCategories(data?.categories)}</div>
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
