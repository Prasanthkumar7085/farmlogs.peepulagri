import styles from "./view-scout-threads.module.css";
import React, { use, useEffect, useState } from "react";
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
import Checkbox from '@mui/material/Checkbox';
import { relative } from "path";
import CustomGalleryItem from "@/components/Core/CustomCheckBox";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';



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
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [content, setContent] = useState<any>()

  let tempImages: any = [...selectedItems];


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
      const lines = response?.data?.findings?.split('\n');
      setContent(lines)
      if (response?.data?.attachments?.length) {

        setDownloadUrls(response?.data?.attachments);
        setSelectedFile(response?.data?.attachments)

        setResponseAttachmentsFormat({ attachmentdetails: response?.data?.attachments });
      }
      else {
        setResponseAttachmentsFormat({ attachmentdetails: response?.data?.attachments });

      }
    }
    setLoading(false);
  }



  const handleChange = (itemId: any) => {
    const itemIndex = tempImages.indexOf(itemId);
    if (itemIndex === -1) {
      tempImages.splice(1, 0, itemId)
    }
    else {
      tempImages.splice(itemIndex, 1);
    }
    setSelectedItems(tempImages)



  };

  const setResponseAttachmentsFormat = ({ attachmentdetails }: any) => {
    let details = [];
    if (attachmentdetails.length) {
      details = attachmentdetails.map((item: ScoutAttachmentDetails, index: number) => {

        if (item.type.includes('video')) {
          return {
            src: "/videoimg.png", height: 80,
            width: 60, caption: `${index + 1} image`, original: item.url, isSelected: false, id: item._id,
          }
        }
        else if (item.type.includes('application')) {
          return {
            src: "/pdf-icon.png", height: 80,
            width: 60, caption: `${index + 1} image`, original: item.url, isSelected: false, id: item._id,
          }
        }
        else {
          return {
            src: item.url,
            height: 80,
            width: 60,
            isSelected: false,
            id: item._id,

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



  const deleteImagesEvent = async () => {
    setDeleteLoading(true)
    let obj = {
      "attachment_ids": tempImages
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
        tempImages = []
        setSelectedItems([])
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
            <h3 className={styles.heading1}>Findings</h3>
            {content?.map((line: any, index: any) => (
              <p className={styles.descriptiontext} key={index}>
                {content ? line : "-"}
              </p>))}
          </div>

          <div className={styles.attachmentscontainer}>
            <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between" }}>
              <h3 className={styles.heading}>Attachments</h3>
              <Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} onClick={() => setFileUploadOpen(true)}>Add</Button>
            </div>

            <Card sx={{
              width: "100%", minHeight: "100px",
            }}>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)", /* Four columns with a width of 60px each */
                gridGap: "0.5rem",
                margin: "0.5rem"
              }}>
                {images.length !== 0 ? images.map((image: any, index: any) => (

                  <div style={{ position: "relative", height: "100px", }} key={index}>
                    <img src={image.src} alt={image.alt} width={'100%'} height={"100%"} onClick={() => handleClick(index, image)} style={{ cursor: "pointer", borderRadius: "5px", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 0, right: 0 }}>
                      <Checkbox

                        sx={{
                          color: "#7f7f7f",
                          '& .MuiSvgIcon-root': {
                            color: "#7f7f7f"
                          }
                        }}
                        size="small"
                        checked={(tempImages.find((ite: any) => ite == image.id)) ? true : false}
                        onChange={() => handleChange(image.id)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        color="secondary"
                        title={image.id}
                      />
                    </div>
                  </div>

                )) : <div style={{ width: "100%", marginLeft: "100%" }}>No Attachements</div>}
              </div>
            </Card>



            {fileUploadOpen == false ?
              <CommentsComponent /> : ""}

          </div>

        </div> : ""}
      {fileUploadOpen == true &&
        <FileUploadEditComponent captureFileUploadOptions={captureFileUploadOptions} />}



      <LoadingComponent loading={loading} />
      <VideoDialogForScout open={openDialog} onClose={handleCloseDialog} mediaArray={selectedFile} index={indexOfSeletedOne} data={data} />
      {tempImages?.length !== 0 ?
        <div style={{
          position: "sticky",
          bottom: "1rem",
          // backgroundColor: "black",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          color: "white",
          cursor: "pointer"
        }} onClick={() => setDeleteOpen(true)}>
          <div style={{ background: "#2B53BE", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", borderRadius: "30px" }}>
            <DeleteOutlineRoundedIcon sx={{ fontSize: "18px" }} />
            <p style={{ margin: "0 ", fontWeight: "500" }}>

              Delete
            </p>
          </div>
        </div> : ""}
      {deleteOpen ? <AlertImagesDelete open={deleteOpen} deleteImagesEvent={deleteImagesEvent} setDialogOpen={setDeleteOpen} loading={deleteLoading} /> : ''}

    </div >
  );
};

export default ViewScoutThreads;
