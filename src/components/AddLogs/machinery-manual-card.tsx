
import timePipe from "@/pipes/timePipe";
import styles from "./machinery-manual-card.module.css";
import { AdditionalResourcesType, GetLogByIdResponseDataType, ResourcesType } from "@/types/logsTypes";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getLogAttachmentsService from "../../../lib/services/LogsService/getLogAttachmentsService";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from "@mui/material/IconButton";
import Image from "next/image";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import deleteLogAttachmentService from "../../../lib/services/LogsService/deleteLogAttachmentService";
import { CircularProgress } from "@mui/material";


const MachineryManualCard = ({ data }: { data: GetLogByIdResponseDataType | null | undefined | any }) => {

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

  const getImageName = (name: string) => {

    let array = name.split('.');

    let lastElement = array[array.length - 1];

    let startAlpha = name.slice(0, 10);

    if (name.length > 13) {
      return startAlpha + '...' + lastElement;
    } else {
      return name
    }

  }

  const getSourceForThumnail = (src: string) => {
    if (src && src.includes('.pdf')) {
      return '/pdf.svg'
    } else return '/image.svg'
  }

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [deleteIndex, setDeleteIndex] = useState(0);
  const deletePhoto = async (item: any, index: number) => {

    setDeleteIndex(index);
    setDeleteLoading(true);
    const response = await deleteLogAttachmentService(router?.query?.log_id as string, item.attachment_id);

    if (response.success) {
      getDownloadLinks();
    }
    setDeleteLoading(false);

  }


  return (
    <div className={styles.bodyPart}>
      <div className={styles.dataGroup}>
        <div className={styles.eachBlock}>
          <div className={styles.inputWithLabel}>
            <h5 className={styles.label}>Work Type</h5>
            <p className={styles.value}>

              {data?.work_type == 'ALL' ?
                <>
                  <span>{`Machinery`}</span>
                  <span className={styles.span}>{`& `}</span>
                  <span className={styles.manual}>Manual</span>
                </>
                : data?.work_type}

            </p>
          </div>
        </div>
        <div className={styles.eachBlock1}>
          <h5 className={styles.label}>Date</h5>
          <div className={styles.dateRange}>
            <div className={styles.fromDate}>
              <div className={styles.text}>
                {data?.from_date_time ? timePipe(data?.from_date_time, 'DD, MMM YYYY') : ""}
              </div>
            </div>
            <div className={styles.divider}>-</div>
            <div className={styles.fromDate}>
              <div className={styles.text}>
                {data?.to_date_time ? timePipe(data?.to_date_time, 'DD, MMM YYYY') : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resouces Table */}
      <div className={styles.dataGroup1}>
        <div className={styles.subTitle}>
          <h4 className={styles.text2}>Resources</h4>
        </div>
        <div className={styles.tableGroup}>
          <div className={styles.tableHead}>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Resources Type</h5>
            </div>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Quantity</h5>
            </div>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Total Hours</h5>
            </div>
          </div>

          {data?.resources.length ? data?.resources.map((item: ResourcesType, index: number) => {
            return (
              <div className={styles.tableRow} key={index}>
                <div className={styles.inputCell}>
                  <p className={styles.text3}>{item.title}</p>
                </div>
                <div className={styles.inputCell1}>
                  <p className={styles.dropdownText}>{item.quantity}</p>
                </div>
                <div className={styles.inputCell2}>
                  <p className={styles.dropdownText}>{item.total_hours}</p>
                </div>
              </div>
            )
          }) : ""
          }
        </div >
      </div >


      {data?.additional_resources.length ? <div className={styles.dataGroup2}>
        <div className={styles.subTitle}>
          <h4 className={styles.text2}>Additional Information</h4>
        </div>
        <div className={styles.tableGroup}>
          <div className={styles.tableHead}>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Pesticide</h5>
            </div>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Quantity</h5>
            </div>
            <div className={styles.inputField}>
              <h5 className={styles.label}>Units</h5>
            </div>
          </div>

          {data?.additional_resources.map((item: AdditionalResourcesType, index: number) => {
            return (
              <div className={styles.tableRow} key={index}>
                <div className={styles.inputCell}>
                  <p className={styles.text3}>{item.title}</p>
                </div>
                <div className={styles.inputCell1}>
                  <p className={styles.dropdownText}>{item.quantity}</p>
                </div>
                <div className={styles.inputCell2}>
                  <p className={styles.dropdownText}>{item.units}</p>
                </div>
              </div>
            )
          })}

        </div>
      </div > : ""
      }


      <div className={styles.dataGroup3}>
        <div className={styles.subTitle2}>
          <div className={styles.textWrapper}>
            <div className={styles.text8}>Attachments</div>
          </div>
        </div>
        <div className={styles.attachments}>
          {downloadUrls.map((item: any, index: number) => {
            return (
              <div className={styles.eachFile} key={index}>
                <Image src={getSourceForThumnail(item.file_name)} height={20} width={20} alt={'image'} />
                <span className={styles.fileName}>{getImageName(item.file_name)}</span>
                <div>
                  <IconButton onClick={() => deletePhoto(item, index)}>
                    {deleteLoading && index == deleteIndex ?
                      <CircularProgress size="1.5rem" sx={{ color: "red" }} />
                      : <DeleteForeverIcon color="error" />}
                  </IconButton>
                <IconButton onClick={() => window.open(item.downloadUrl)}>
                  <OpenInNewIcon />
                </IconButton>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div >
  );
};

export default MachineryManualCard;
