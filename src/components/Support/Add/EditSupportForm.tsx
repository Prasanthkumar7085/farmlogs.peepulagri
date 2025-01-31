import { AddSupportPayload } from "@/types/supportTypes";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import editSupportService from "../../../../lib/services/SupportService/editSupportService";
import getSupportByIdService from "../../../../lib/services/SupportService/getSupportByIdService";
import AddSupportQueryDetails from "./AddSupportQueryDetails";
import {
  Button,
  Chip,
  CircularProgress,
  Fab,
  Grid,
  Typography,
} from "@mui/material";
import FooterActionButtons from "../../AddLogs/footer-action-buttons";
import SupportAttachments from "../SupportAttachments";
import addAttachmentsService from "../../../../lib/services/SupportService/addAttachmentsService";
import uploadFileToS3 from "../../../../lib/services/LogsService/uploadFileToS3InLog";
import { useSelector } from "react-redux";
import AlertComponent from "../../Core/AlertComponent";
import styles from "./addSupportForm.module.css";
import SupportRecording from "./SupportRecording";
import LoadingComponent from "@/components/Core/LoadingComponent";

const EditSupportForm = () => {
  const router: any = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [supportOneDetails, setSupportOneDetails] = useState<any>();
  const [loadingOnImagesUpload, setLoadingOnImagesUpload] = useState<boolean>(false);

  const [query, setQuery] = useState<string>(supportOneDetails?.title);
  const [categories, setCategories] = useState<Array<string>>();
  const [description, setDescription] = useState<string>("");

  const [supportDetails, setSupportDetails] = useState<Partial<AddSupportPayload>>();

  const [files, setFiles] = useState<any>([]);
  const [filesDetailsAfterUpload, setFilesDetailsAfterUpload] = useState<any>([]);
  const [audioDetailsAfterUpload, setAudioDetailsAfterUpload] = useState<any>({});

  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [uploadOrNot, setUploadOrNot] = useState(false);
  const [errorMessages, setErrorMessages] = useState<any>();
  const [loadAttachments, setLoadAttachments] = useState(true);
  const [uploadFailedMessage, setUploadFailedMessage] = useState('');



  useEffect(() => {
    setQuery(supportOneDetails?.title);
    setCategories(supportOneDetails?.categories);
    setDescription(supportOneDetails?.description);
  }, [supportOneDetails]);

  useEffect(() => {
    collectSupportData();
  }, [query, categories, description]);

  useEffect(() => {
    getOneSupportDetails();
  }, [router]);

  const collectSupportData = () => {
    let supportData: Partial<AddSupportPayload> = {
      title: query,
      description: description,
      categories: categories,
      status: supportOneDetails?.status,
    };
    setSupportDetails(supportData);
  };

  const editSupport = async () => {
    setLoading(true);
    setErrorMessages({});
    const array = supportOneDetails?.attachments;

    let attachmentsArray: any = [];

    if (array.length) {
      if (Object.keys(audioDetailsAfterUpload).length) {
        attachmentsArray = [
          ...filesDetailsAfterUpload,
          ...array,
          audioDetailsAfterUpload,
        ];
      } else {
        attachmentsArray = [...filesDetailsAfterUpload, ...array];
      }
    } else {
      if (Object.keys(audioDetailsAfterUpload).length) {
        attachmentsArray = [
          ...filesDetailsAfterUpload,
          audioDetailsAfterUpload,
        ];
      } else {
        attachmentsArray = [...filesDetailsAfterUpload];
      }
    }

    let body = {
      ...supportDetails,
      attachments: [...attachmentsArray],
    };

    try {
      const response = await editSupportService(
        body,
        router?.query?.support_id
      );
      collectSupportData();
      if (response?.success) {
        setAlertMessage(response?.message);
        setAlertType(true);
        setTimeout(() => {
          router.back();
        }, 500);
      } else if (response?.status == 422) {
        setErrorMessages(response?.errors);
      } else {
        setAlertMessage(response?.message);
        setAlertType(false);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getOneSupportDetails = async () => {
    setLoading(true);
    try {
      const response = await getSupportByIdService(router?.query?.support_id);
      setSupportOneDetails(response?.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onChangeFile = (e: any, check = false) => {
    setUploadFailedMessage('');
    setLoadAttachments(false);
    setTimeout(() => {
      setLoadAttachments(true);
    }, 1);
    setUploadOrNot(false);
    setFiles(e.target.files);
    uploadFiles(e.target.files);
  };
  const uploadFiles = async (filesSelected:any) => {
    setLoadingOnImagesUpload(true);
    let tempFilesStorage = Array.from(filesSelected).map((item: any) => {
      return { original_name: item.name, type: item.type, size: item.size };
    });

    const response = await addAttachmentsService(
      { attachments: tempFilesStorage },
      accessToken
    );
    if (response.success) {
      await postAllImages(response.data, tempFilesStorage,filesSelected);
    } else {
      setFiles([]);
      setUploadFailedMessage(response?.message);
      setAlertMessage("File(s) uploaded failed!");
      setAlertType(false);
      setLoadingOnImagesUpload(false);
    }
  };

  const postAllImages = async (response: any, tempFilesStorage: any,filesSelected:any) => {
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
          arrayForResponse.push({
            ...rest,
            size: tempFilesStorage[index].size,
          });
          checkUploadOrNot = true;
        } else {
        setFiles([]);
        setAlertMessage("File(s) uploaded failed!");
          setAlertType(false);
          checkUploadOrNot = false;
          break;
        }

    }
    setUploadOrNot(checkUploadOrNot);
    setFilesDetailsAfterUpload([
      ...filesDetailsAfterUpload,
      ...arrayForResponse,
    ]);

    setLoadingOnImagesUpload(false);
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
      {router?.query?.support_id && supportOneDetails?.title ? (
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
                <SupportRecording
                  setAudioDetailsAfterUpload={setAudioDetailsAfterUpload}
                />

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
                  <FooterActionButtons editLog={editSupport} />
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
      ) : (
        ""
      )}
      <LoadingComponent loading={loading} />
    </div>
  );
};

export default EditSupportForm;
