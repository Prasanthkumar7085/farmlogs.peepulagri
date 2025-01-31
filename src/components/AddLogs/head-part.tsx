
import styles from "./head-part.module.css";
import { useRouter } from "next/router";
import { Button, Chip, Icon } from "@mui/material";
import { useEffect, useState } from "react";
import getLogAttachmentsService from "../../../lib/services/LogsService/getLogAttachmentsService";
import getAllCategoriesService from "../../../lib/services/Categories/getAllCategoriesService";
import IconButtonComponent from "../Core/IconButtonComponent";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';


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
      if (list && list.includes(categoryItem?.slug)) {
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
        <h4 className={styles.text}>View Log</h4>
        <Button variant="outlined" color="error" onClick={() => router.push(`/farm/${router.query.farm_id}/logs/${router.query.log_id}/edit`)}><DriveFileRenameOutlineIcon /></Button>
      </div>
      <div className={styles.headerContent}>
        <div className={styles.label}>
          <div className={styles.dropdownText}>{getCategoriesList(data?.categories)}</div>
        </div>
        <div className={styles.content}>
          <h3 className={styles.h3title}>
            {data?.title?.slice(0, 1).toUpperCase() + data?.title?.slice(1,)}
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
