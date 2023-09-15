import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import styles from "./addSupportForm.module.css";
import FooterActionButtons from "@/components/AddLogs/footer-action-buttons";
import AddSupportQueryDetails from "./AddSupportQueryDetails";
import { AddSupportPayload } from "@/types/supportTypes";
import addSupportService from "../../../../lib/services/SupportService/addSupportService";
import addAttachmentsService from "../../../../lib/services/SupportService/addAttachmentsService";
import uploadFileToS3 from "../../../../lib/services/LogsService/uploadFileToS3InLog";
import { useRouter } from "next/router";
import SupportAttachments from "@/components/Support/SupportAttachments";
import AlertComponent from "@/components/Core/AlertComponent";
import { useSelector } from "react-redux";
import SupportRecording from "./SupportRecording";
import LoadingComponent from "@/components/Core/LoadingComponent";


const AddSupportForm = () => {

  const router: any = useRouter();

  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);

  const [query, setQuery] = useState<any>();
  const [categories, setCategories] = useState<Array<string>>();
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<any>([]);
  const [filesDetailsAfterUpload, setFilesDetailsAfterUpload] = useState<any>([]);
  const [audioDetailsAfterUpload, setAudioDetailsAfterUpload] = useState<any>({});
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<boolean>(false);
  const [loadingOnImagesUpload, setLoadingOnImagesUpload] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [uploadOrNot, setUploadOrNot] = useState(false);
  const [loadAttachments, setLoadAttachments] = useState(true);
  const [uploadFailedMessage, setUploadFailedMessage] = useState('');


  const [supportDetails, setSupportDetails] = useState<Partial<AddSupportPayload>>();
  const [errorMessages, setErrorMessages] = useState<any>();

  useEffect(() => {
    collectSupportData();
  }, [
    query,
    categories,
    description,
    filesDetailsAfterUpload,
    audioDetailsAfterUpload,
  ]);

  const collectSupportData = () => {

    let supportData: Partial<AddSupportPayload> = {
      title: query,
      description: description,
      categories: categories,
      attachments: getAttachments(),
      status: "OPEN"
    };
    setSupportDetails(supportData);
  };

  const getAttachments = () => {
    if (Object.keys(audioDetailsAfterUpload).length)
      return [...filesDetailsAfterUpload, audioDetailsAfterUpload]
    return [...filesDetailsAfterUpload]
  }


  const addSupport = async () => {
    setLoading(true);
    setErrorMessages({})
    try {
      const response = await addSupportService(supportDetails, accessToken);

      if (response.success) {
        setAlertMessage("Add Support Successful!");
        setAlertType(true);
        setTimeout(() => {
          router.push('/support');
        }, 1000);
      } else if (response?.status == 422) {
        setErrorMessages(response?.errors);
      } else {
        setAlertMessage("Add Support Failed!");
        setAlertType(false);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const onChangeFile = (e: any) => {
    setUploadFailedMessage('');
    setLoadAttachments(false);
    setTimeout(() => {
      setLoadAttachments(true);
    }, 1);
    setUploadOrNot(false);
    setFiles(e.target.files);

    uploadFiles(e.target.files);
  };
  const uploadFiles = async (filesSelected: any) => {

    setLoadingOnImagesUpload(true);
    let tempFilesStorage = Array.from(filesSelected).map((item: any) => {
      return { original_name: item.name, type: item.type, size: item.size };
    });

    const response = await addAttachmentsService(
      { attachments: tempFilesStorage },
      accessToken
    );
    if (response.success) {
      await postAllImages(response.data, tempFilesStorage, filesSelected);
    } else {
      setFiles([]);
      setUploadFailedMessage(response?.message);
      setAlertMessage("File(s) uploaded failed!");
      setAlertType(false);
    }
    setLoadingOnImagesUpload(false);
  };


  const postAllImages = async (response: any, tempFilesStorage: any, filesSelected: any) => {
    let arrayForResponse: any = [];

    let checkUploadOrNot = false;
    for (let index = 0; index < response.length; index++) {
      let uploadResponse: any = await uploadFileToS3(
        response[index].target_url,
        filesSelected[index]
      );
      if (uploadResponse.ok) {
        setAlertMessage(`File(s) uploaded successful!`);
        setAlertType(true);
        const { target_url, ...rest } = response[index];
        arrayForResponse.push({ ...rest, size: tempFilesStorage[index].size });
        checkUploadOrNot = true;
      } else {
        setFiles([]);
        setAlertMessage("File(s) uploaded failed!");
        setAlertType(false);
        checkUploadOrNot = false;
        break;
      }
    }
    setUploadOrNot(checkUploadOrNot)
    setFilesDetailsAfterUpload(arrayForResponse);
  };

  const deleteSelectedFile = (index: any) => {
    let array = [...filesDetailsAfterUpload];
    let filesArray = [...files];
    array.splice(index, 1);
    filesArray.splice(index, 1);
    setFiles([...filesArray])
    setFilesDetailsAfterUpload([...array]);

  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <div className={styles.addSupportForm}>
        <Grid container direction="row" justifyContent="center" spacing={3}>
          <Grid item xs={12} sm={10} md={6}>
            <AddSupportQueryDetails
              errorMessages={errorMessages}
              query={query}
              categories={categories}
              description={description}
              setQuery={setQuery}
              setCategories={setCategories}
              setDescription={setDescription}
            />
          </Grid>
          <Grid item xs={12} sm={10} md={6}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="subtitle2"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "600",
                  color: "var(--gray-700)",
                  marginBlock: "4px",
                }}
              >
                Mic
              </Typography>
              <SupportRecording setAudioDetailsAfterUpload={setAudioDetailsAfterUpload} />
              <div>
                <SupportAttachments
                  loadAttachments={loadAttachments}
                  deleteSelectedFile={deleteSelectedFile}
                  onChangeFile={onChangeFile}
                  files={files}
                  loadingOnImagesUpload={loadingOnImagesUpload}
                  uploadOrNot={uploadOrNot}
                  uploadFailedMessage={uploadFailedMessage}
                />
              </div>
              <div>
                <FooterActionButtons addLogs={addSupport} />
                <AlertComponent
                  alertMessage={alertMessage}
                  alertType={alertType}
                  setAlertMessage={setAlertMessage}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default AddSupportForm;
