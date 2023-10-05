import styles from "./view-scout-threads.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import getSingleScoutService from "../../../../lib/services/ScoutServices/getSingleScoutService";
import { ScoutAttachmentDetails, SingleScoutResponse } from "@/types/scoutTypes";
import timePipe from "@/pipes/timePipe";
import { Button, Card } from "@mui/material";
import LoadingComponent from "@/components/Core/LoadingComponent";
import { Gallery } from "react-grid-gallery";
import VideoDialogForScout from "@/components/VideoDiloagForSingleScout";
import CommentsComponent from "../Comments/CommentsComponent";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import AlertImagesDelete from "@/components/Core/DeleteImagesAlert/alert-delete-images";
import FileUploadEditComponent from "../EditItem/FileUploadEdit";
import AddIcon from '@mui/icons-material/Add';




const ViewScoutThreads = () => {


  const router = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);


  const [data, setData] = useState<SingleScoutResponse>();
  const [downloadUrls, setDownloadUrls] = useState<Array<ScoutAttachmentDetails>>([]);
  const [images, setImages] = useState<any>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>([])
  const [indexOfSeletedOne, setIndexOfseletedOne] = useState<any>();

  const [imagesForDelete, setImagesForDelete] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<any>()
  const [cameraOpen, setCameraOpen] = useState<any>(false)
  const [fileUploadOpen, setFileUploadOpen] = useState<any>(false)


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const getSingleScout = async () => {
    const response = await getSingleScoutService(router.query?.scout_id as string, accessToken);

    if (response?.success) {
      setData(response?.data);
      if (response?.data?.attachments?.length) {
        setDownloadUrls(response?.data?.attachments);
        setSelectedFile(response?.data?.attachments)

        setResponseAttachmentsFormat({ attachmentdetails: response?.data?.attachments });
      }
    }
    setLoading(false);
  }

  const setResponseAttachmentsFormat = ({ attachmentdetails }: any) => {
    let details = [];
    if (attachmentdetails.length) {
      details = attachmentdetails.map((item: ScoutAttachmentDetails, index: number) => {

        if (item.type.includes('video')) {
          return {
            src: "/videoimg.png", height: 80,
            width: 60, caption: `${index + 1} image`, original: item.url, isSelected: false, id: item._id
          }
        } else {
          return {
            src: item.url, height: 80,
            width: 60,
            isSelected: false,
            id: item._id
          }
        }
      })
    }
    setImages(details);
  }

  useEffect(() => {
    if (router.isReady, accessToken) {
      getSingleScout();
    }
  }, [router.isReady, accessToken]);



  const handleClick = (index: number, item: any) => {
    handleOpenDialog();
    setIndexOfseletedOne(index);
  };

  const getSelectedItems = (index: any) => {

    const nextImages = images.map((image: any, i: number) => i === index ? { ...image, isSelected: !image.isSelected } : image);
    setImages([...nextImages]);

    const filteredImages = nextImages.filter((item: any) => item.isSelected);
    console.log(filteredImages)
    // Create a new array of objects by matching urls
    const newArray = selectedFile.filter((obj1: any) => {
      return filteredImages.some((obj2: any) => obj1._id === obj2.id);
    });
    const attachmentIds = newArray.map((item: any) => item._id)
    console.log(attachmentIds)
    setImagesForDelete([...attachmentIds]);
  }

  const deleteImagesEvent = async () => {
    setDeleteLoading(true)
    let obj = {
      "attachment_ids": imagesForDelete
    }
    let options = {
      method: "DELETE",
      body: JSON.stringify(obj),
      headers: new Headers({
        'content-type': 'application/json',
        'authorization': accessToken
      })
    }
    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/${router.query.scout_id}/attachments`, options)
      let responseData = await response.json()
      if (responseData.success == true) {
        getSingleScout()
        setDeleteOpen(false)
        setImagesForDelete([])
      }
    }
    catch (err) {
      console.log(err)
    }
    finally {
      setDeleteLoading(false)
    }
  }
  const captureFileUploadOptions = (value: any) => {
    if (value == "close") {
      setFileUploadOpen(false)
    }
    else if (value == "success") {
      getSingleScout();
      setFileUploadOpen(false)
    }
    else if (value == "camera") {
      setCameraOpen(true)
    }
    else if (value == "cameraoff") {
      setFileUploadOpen(true)
      setCameraOpen(false)
    }
  }

  return (
    <div className={styles.viewscoutthreads} id="view-scout-threads">
      {cameraOpen == false ?
        <div className={styles.headerandattachments}>
          <div className={styles.headertextwrapper}>
            <h2 className={styles.farmTitle}>{data?.farm_id?.title ? data?.farm_id?.title : "Farm1"}</h2>
            <p className={styles.createdAt}>{data?.createdAt ? timePipe(data?.createdAt, 'DD, MMM YYYY hh:mm a') : ""}</p>
          </div>
          <div className={styles.description}>
            <h3 className={styles.heading1}>Description</h3>
            <p className={styles.descriptiontext}>
              {data?.description ? data?.description : "-"}
            </p>
          </div>

          <div className={styles.attachmentscontainer}>
            <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
              <h3 className={styles.heading}>Attachments</h3>
              <Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} onClick={() => setFileUploadOpen(true)}>Add</Button>
            </div>
            {images.length ? <Card sx={{ width: "100%", minHeight: "100px", padding: "0.25rem" }}>
              <Gallery images={images} onClick={handleClick} onSelect={getSelectedItems} enableImageSelection={true} />
            </Card> : ""}

            <CommentsComponent />


          </div>

        </div> : ""}
      {fileUploadOpen == true &&
        <FileUploadEditComponent captureFileUploadOptions={captureFileUploadOptions} />}



      <LoadingComponent loading={loading} />
      <VideoDialogForScout open={openDialog} onClose={handleCloseDialog} mediaArray={selectedFile} index={indexOfSeletedOne} />
      {imagesForDelete?.length !== 0 ?
        <div style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "black",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          color: "white",
          cursor: "pointer"
        }} onClick={() => setDeleteOpen(true)}>
          <DeleteOutlinedIcon sx={{ fontSize: "16px" }} />Delete
        </div> : ""}
      {deleteOpen ? <AlertImagesDelete open={deleteOpen} deleteImagesEvent={deleteImagesEvent} setDialogOpen={setDeleteOpen} loading={deleteLoading} /> : ''}

    </div >
  );
};

export default ViewScoutThreads;
