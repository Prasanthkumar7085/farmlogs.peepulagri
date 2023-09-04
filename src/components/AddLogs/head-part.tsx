
import styles from "./head-part.module.css";
import IconButtonComponent from "../Core/IconButtonComponent";
import { useRouter } from "next/router";
import { Chip, Icon } from "@mui/material";
import { useEffect, useState } from "react";
import getLogAttachmentsService from "../../../lib/services/LogsService/getLogAttachmentsService";
import getAllCategoriesService from "../../../lib/services/Categories/getAllCategoriesService";


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

  const [categories, setCategoies] = useState([]);

  const getCategories = async () => {
    const response = await getAllCategoriesService();
    if (response.success) {
      setCategoies(response?.data)
    }

  }

  useEffect(() => {
    getCategories();
  }, [])

  const getCategoriesList = (list: any) => {

    let array = categories.map((categoryItem: any) => {
      if (list.includes(categoryItem?.slug)) {
        return categoryItem?.category
      }
    }).filter((e) => e)

    return array?.join(', ')
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
          <div className={styles.dropdownText}>{getCategoriesList(data?.categories)}</div>
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
