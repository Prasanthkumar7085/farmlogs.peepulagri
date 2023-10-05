import type { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { TextField, Button, Icon, IconButton, LinearProgress, Box } from "@mui/material";
import styles from "./comment-form.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { removeOneAttachmentElement, removeTheAttachementsFilesFromStore, storeAttachementsFilesArray } from "@/Redux/Modules/Conversations";
import DoneIcon from '@mui/icons-material/Done';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const CommentForm = ({ afterCommentAdd }: any) => {

  const router = useRouter()
  const dispatch = useDispatch()
  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
  const filesFromStore = useSelector((state: any) => state.conversation?.attachmentsFilesList);


  const [comment, setComment] = useState<any>()
  const [multipleFiles, setMultipleFiles] = useState<any>()
  const [fileProgress, setFileProgress] = useState<number[] | any>();
  const [attachments, setAttachments] = useState<any>([])
  const [selectedCrop, setSelectedCrop] = useState<any>()
  const [loading, setLoading] = useState<any>()


  let tempFilesStorage: any = [...attachments]

  useEffect(() => {
    getCropsDetails()
  }, [])


  //convert the kb into mb
  const bytesToMB = (bytes: any) => {
    return bytes / (1024 * 1024);
  }


  const removeFile = (index: number) => {
    const selectedFilesCopy = [...multipleFiles];
    selectedFilesCopy.splice(index, 1);

    const fileProgressCopy = [...fileProgress];
    fileProgressCopy.splice(index, 1);

    const tempFilesStorageCopy = [...tempFilesStorage]
    tempFilesStorageCopy.splice(index, 1)
    dispatch(removeOneAttachmentElement(index))

    setMultipleFiles(selectedFilesCopy);
    setFileProgress(fileProgressCopy);
  };
  const removeFileAfterAdding = (index: number) => {
    const selectedFilesCopy = [...multipleFiles];
    selectedFilesCopy.splice(index, 1);

    const fileProgressCopy = [...fileProgress];
    fileProgressCopy.splice(index, 1);

    setMultipleFiles(selectedFilesCopy);
    setFileProgress(fileProgressCopy);
    dispatch(removeOneAttachmentElement(index))

  };



  //get all crops name
  const getCropsDetails = async () => {

    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${router.query.farm_id}/crops/list`, { method: "GET" });
      let responseData: any = await response.json();

      if (responseData.success == true) {

        if (router.query.crop_id) {

          let cropObj = responseData?.data?.find((item: any) => item._id == router.query.crop_id);
          setSelectedCrop(cropObj);

        }

      }
    } catch (err) {
      console.error(err);

    }
  }




  const addComment = async () => {
    setLoading(true)
    let body = {
      "content": comment,
      "type": "DIRECT",
      "attachments": tempFilesStorage
    }
    let options = {
      method: "POST",
      headers: new Headers({
        'content-type': 'application/json',
        'authorization': accessToken
      }),
      body: JSON.stringify(body)
    }
    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/${router.query.scout_id}/comments`, options)
      let responseData = await response.json()
      if (responseData.success == true) {
        setComment("")
        afterCommentAdd(true)
        setMultipleFiles([])
        setAttachments([])
        dispatch(removeTheAttachementsFilesFromStore([]))
      }
    } catch (err) {
      console.log(err)
    }
    finally {
      setLoading(false)

    }
  }


  //files upload event
  const handleFileChange = async (e: any) => {
    let copy = [...e.target.files, ...filesFromStore]
    dispatch(storeAttachementsFilesArray(e.target.files))

    const fileProgressCopy = [...new Array(e.target.files?.length).fill(0)]; // Create a copy of the progress array
    let temp = [...fileProgressCopy, ...new Array(filesFromStore?.length).fill(100)]
    setFileProgress(temp)
    setMultipleFiles(e.target.files)

    Array.from(e.target.files).map(async (item: any, index: number) => {

      await fileUploadEvent(item, index, temp, setFileProgress)

    })
  };


  //file upload normal smaller than 5 mb
  const fileUploadEvent = async (item: any, index: any, fileProgressCopy: any, setFileProgress: any) => {

    let obj = {

      "attachment":
      {

        "original_name": item.name,
        "type": item.type,
        "size": item.size,
        "source": "scouting",
        "crop_slug": selectedCrop?.slug,
        "farm_id": router.query.farm_id
      }

    }

    let options: any = {
      method: "POST",
      body: JSON.stringify(obj),
      headers: new Headers({
        'content-type': 'application/json',
        'authorization': accessToken

      }),

    }

    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/attachments`, options);
      let responseData = await response.json();
      if (responseData.success == true) {
        let preSignedResponse = await fetch(responseData.data.target_url, { method: "PUT", body: item });
        fileProgressCopy[index] = 100;
        setFileProgress([...fileProgressCopy]);
        tempFilesStorage.splice(1, 0, { original_name: responseData.data.original_name, type: item.type, size: item.size, name: responseData.data.name, crop_slug: responseData.data.crop_slug, path: responseData.data.path })
        setAttachments(tempFilesStorage)

      }

    }
    catch (err) {
      console.error(err);
    }

  }


  return (
    <div className={styles.commentform}>
      <TextField
        className={styles.chatBox}
        color="primary"
        rows={2}
        placeholder="Enter your Message... "
        fullWidth={true}
        variant="outlined"
        multiline
        value={comment ? comment : ""}
        onChange={(e) => setComment(e.target.value)}
      />

      {multipleFiles && Array?.from(multipleFiles).map((item: any, index: any) => (
        <div className={styles.uploadprogress} id="upload-progress" key={index}>
          <div className={styles.progress} id="progress">
            <img className={styles.image21} alt="" src={"/nj.jpg"} />
            <div className={styles.progressdetails}>
              <div className={styles.uploaddetails}>
                <div className={styles.uploadcontroller}>
                  <div className={styles.uploadname}>
                    <div className={styles.uploadItem}>
                      <div className={styles.photojpg}>{item.name?.slice(0, 7)}...{item.type} </div>
                      <div className={styles.photojpg}>{bytesToMB(item.size).toFixed(2)}MB</div>
                    </div>
                    {fileProgress[index] == 100 ?
                      <div className={styles.photojpg}>
                        <IconButton>
                          <DoneIcon sx={{ color: "#05A155" }} />
                        </IconButton>
                        <IconButton onClick={() => removeFileAfterAdding(index)}>
                          <DeleteForeverIcon sx={{ color: "#820707" }} />
                        </IconButton>
                      </div> : ""}
                  </div>
                  {fileProgress[index] !== 100 ?
                    <img
                      className={styles.close41}
                      alt=""
                      src="/close-icon.svg"
                      onClick={() => removeFile(index)}
                    /> : ""}

                </div>
                <Box sx={{ width: '100%' }}>
                  {fileProgress[index] == 0 ?
                    <LinearProgress /> :
                    fileProgress[index] !== 100 ? <LinearProgress variant="determinate" value={fileProgress[index]} /> : ""
                  }
                </Box>
              </div>
              {fileProgress[index] == 100 ? "" :
                <div className={styles.uploadstatus}>
                  <div className={styles.completed}>{fileProgress[index]?.toFixed(2) + "%"}</div>

                </div>}
            </div>
          </div>
        </div>
      ))}
      <div className={styles.actions}>
        <div className={styles.attachments}>
          <div className={styles.link}>
            <label >
              <img className={styles.groupIcon} alt="" src="/group.svg" />
              <input
                type="file"
                alt="images-upload"
                multiple
                onChange={handleFileChange}
                hidden
              />
            </label>
          </div>
          <label >
            <img className={styles.imageIcon} alt="" src="/image7@2x.png" />
            <input
              type="file"
              alt="images-upload"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>

        <Button
          className={styles.sendbutton}
          color="primary"
          size="medium"
          variant="contained"
          disabled={comment ? false : true}
          onClick={addComment}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
