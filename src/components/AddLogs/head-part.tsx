
import styles from "./head-part.module.css";
import IconButtonComponent from "../Core/IconButtonComponent";
import { useRouter } from "next/router";
import { Chip, Icon } from "@mui/material";
import { useEffect, useState } from "react";
import getLogAttachmentsService from "../../../lib/services/LogsService/getLogAttachmentsService";


const HeadPart = ({ data }: any) => {

  const router = useRouter();

  useEffect(() => {
    if (data && router.isReady) {
      getDownloadLinks();
    }
  }, [data, router.isReady])

  const [downloadUrls, setDownloadUrls] = useState<any>([]);

  const getDownloadLinks = async () => {

    let response = await getLogAttachmentsService(router.query.log_id);
    if (response.success) {
      setDownloadUrls(response.data.download_urls);
    }

  }

  const getLabel = (item: string) => {
    const categoryOptions = [
      { title: 'Soil Preparation', value: "soil_preparation", color: "#E57373" },
      { title: 'Planting', value: "plainting", color: "#66BB6A" },
      { title: 'Irrigation', value: "irrigation", color: "#64B5F6" },
      { title: 'Fertilization', value: "fertilization", color: "#FFD54F" },
      { title: 'Pest Management', value: "pest_management", color: "#AB47BC" },
      { title: 'Weeding', value: "weeding", color: "#AED581" },
      { title: 'Crop Rotation', value: "crop_rotation", color: "#9575CD" },
      { title: 'Harvesting', value: "harvesting", color: "#FF8A65" },

      { title: 'Livestock Care', value: "livestock_care", color: "#FFD700" },
      { title: 'Breeding & Reproduction', value: "breeding_reproduction", color: "#FF80AB" },
      { title: 'Equipment Management', value: "equipment_management", color: "#78909C" },
      { title: 'Market & Scale Management', value: "market_scale_management", color: "#26A69A" },
      { title: 'Environmental Stewardship', value: "enviranmental_stewardship", color: "#4CAF50" },
      { title: 'Weather Monitoring', value: "weather_monitoring", color: "#42A5F5" },
      { title: 'Financial Management', value: "financial_management", color: "#FFB74D" },
      { title: 'Research and Learning', value: "research_and_learning", color: "#FF5722" },

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
        <IconButtonComponent
          icon={<Icon>arrow_back_sharp</Icon>}
          onClick={() => router.back()}
          size="small"
        />
        <h4 className={styles.text}>View Logs</h4>
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
