import { TextField, Button, Icon, Typography, IconButton, CircularProgress } from "@mui/material";
import styles from "./messagebox.module.css";
import { ChangeEvent, useState } from "react";
import postAMessageInSupportService from "../../../../../lib/services/SupportService/postAMessageInSupportService";
import { useRouter } from "next/router";
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from "react-redux";
import { addNewMessage } from "@/Redux/Modules/Conversations";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import addAttachmentsService from "../../../../../lib/services/SupportService/addAttachmentsService";
import uploadFileToS3 from "../../../../../lib/services/LogsService/uploadFileToS3InLog";
import AlertComponent from "@/components/Core/AlertComponent";



type getAllMessagesBySupportIdType = () => void

const Messagebox = ({ getAllMessagesBySupportId }: { getAllMessagesBySupportId: getAllMessagesBySupportIdType }) => {

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
  const userName = useSelector((state: any) => state.auth.userDetails?.user_details?.full_name);

  const router = useRouter();
  const dispatch = useDispatch();

  const [message, setMessage] = useState<string>('');
  const [files, setFiles] = useState<any>();
  const [loadingOnImagesUpload, setLoadingOnImagesUpload] = useState(false);
  const [filesDetailsAfterUpload, setFilesDetailsAfterUpload] = useState<any>([]);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [loadAttachments, setLoadAttachments] = useState(true);
  const [uploadFailedMessage, setUploadFailedMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<boolean>(false);


  const deleteSelectedFile = (index: number) => {
    let array = [...filesDetailsAfterUpload];
    let filesArray = [...files];
    array.splice(index, 1);
    filesArray.splice(index, 1);
    setFiles([...filesArray])
    setFilesDetailsAfterUpload([...array]);
  }

  const onSendMessage = async () => {

    let createdAt = new Date().toISOString();

    if (message) {
      const body = {
        content: message,
        type: 'REPLY',
        attachments: [...filesDetailsAfterUpload]
      }
      const bodyToStore = {
        ...body,
        createdAt: createdAt,
        reply_to_message_id: {
          full_name: userName
        },
      }
      setMessage('');
      setFiles(null);
      setFilesDetailsAfterUpload([]);
      dispatch(addNewMessage(bodyToStore))
      const response = await postAMessageInSupportService(router.query.support_id as string, body, accessToken);

      if (response.success) {
        getAllMessagesBySupportId();
      }

    }
  }

  const getImageObjectUrl = (file: any) => {
    if (file.type == 'application/pdf')
      return '/pdf.svg'
    else if (file.type.includes('audio'))
      return '/audio.svg'
    else return URL.createObjectURL(file)
  }

  const selectMessageAttachments = (e: any) => {

    setUploadFailedMessage('');
    setLoadAttachments(false);
    setTimeout(() => {
      setLoadAttachments(true);
    }, 1);
    setUploadFailed(false);
    let selectedFiles = e.target.files;

      setFiles(selectedFiles)
      uploadFiles(selectedFiles);

  }

  const uploadFiles = async (filesFromArgs: any) => {


    setLoadingOnImagesUpload(true);
    let tempFilesStorage = Array.from(filesFromArgs).map((item: any) => {
      return { original_name: item.name, type: item.type, size: item.size };
    });

    const response = await addAttachmentsService(
      { attachments: tempFilesStorage },
      accessToken
    );
    if (response.success) {
      await postAllImages(filesFromArgs, response.data, tempFilesStorage);
    } else {
      setFiles([]);
      setUploadFailed(true);
      setUploadFailedMessage(response?.message);
      setAlertMessage("File(s) uploaded failed!");
      setAlertType(false);
    }
    setLoadingOnImagesUpload(false);
  };
  const postAllImages = async (filesFromArgs: any, response: any, tempFilesStorage: any) => {

    let arrayForResponse: any = [];
    for (let index = 0; index < response.length; index++) {
      let uploadResponse: any = await uploadFileToS3(
        response[index].target_url,
        filesFromArgs[index]
      );
      if (uploadResponse.ok) {
        const { target_url, ...rest } = response[index];
        arrayForResponse.push({ ...rest, size: tempFilesStorage[index].size });
        setAlertMessage("File(s) uploaded Successful!");
        setAlertType(true);
      } else {
        setFiles([]);
        setUploadFailed(true);
        setAlertMessage("File(s) uploaded failed!");
        setAlertType(false);
      }
    }
    setFilesDetailsAfterUpload(arrayForResponse);
  };


  return (
    <div className={styles.inputForm}>
      <TextField
        className={styles.chatBox}
        fullWidth
        color="primary"
        variant="outlined"
        placeholder="Enter your message here..."
        type="text"
        size="medium"
        margin="none"
        multiline
        rows={3}
        value={message}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
        onKeyDown={(e: any) => { if (e.key == 'Enter') onSendMessage() }}
      />
      <div className={styles.actions}>
        <div className={styles.attachments}>
          <label>
            <div style={{ border: "1px solid", borderRadius: "5px", padding: "5px 20px 5px 20px", backgroundColor: "#3360cc", color: "white", cursor: "pointer" }} className={styles.uploadFiles}>
              <span>
                Select Files
              </span>
              {loadingOnImagesUpload ?
                <CircularProgress size="1.5rem" sx={{ color: " white" }} />
                : <CloudUploadOutlinedIcon />}
            </div>

            {loadAttachments ? <input
              onChange={selectMessageAttachments}
              className={styles.image}
              type="file"
              multiple
              style={{ display: "none" }}
              accept="image/jpeg, image/png,image/jpg,image/gif,image/webp,image/*, .pdf, .mp3, .wav,.docx,.doc" /> : ""}
          </label>
          <div className="styles.attachmentsContainer">
            {files &&
              Array.from(files).map((file: any, index) => {
                return (

                  <div key={index} className={styles.attachmentItem} style={{backgroundColor: "#F5F7FA"}}>
                  {file ? <img src={getImageObjectUrl(file)} alt={`image-${index}`} height={50} width={50} style={{ objectFit: "cover" }} /> : ""}
                    <Typography>
                        {file.name}
                    </Typography>
                    <IconButton color="error" aria-label="delete" onClick={() => deleteSelectedFile(index)} disabled={loadingOnImagesUpload}>

                        <CloseIcon />
                    </IconButton>
                    </div>
                )
              })}
            {uploadFailedMessage ?
              <p style={{ color: "red", fontSize: "12px" }}>
                {uploadFailedMessage}
              </p>
              : ""}
          </div>

        </div>
        <div className={styles.button}>
          <Button variant="contained" color="primary" onClick={onSendMessage} disabled={loadingOnImagesUpload || !message}>
            Send
          </Button>
        </div>
      </div>

      <AlertComponent
        alertMessage={alertMessage}
        alertType={alertType}
        setAlertMessage={setAlertMessage}
      />
    </div>
  );
};

export default Messagebox;
