import { Box, Button, FormControl, FormHelperText, Icon, IconButton, InputLabel, LinearProgress, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CameraCapture from "./Camera";
import Axios from "axios"
import styles from "./add-scout.module.css";
import Header1 from "../Header/HeaderComponent";
import SelectComponent from "@/components/Core/SelectComponent";
import { useDispatch, useSelector } from "react-redux";
import Camera from "./Camera";
import base64ToFile from "@/pipes/base64FileConvert";
import SelectComponenentForFarms from "@/components/Core/selectDropDownForFarms";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import { useRouter } from "next/router";
import AlertComponent from "@/components/Core/AlertComponent";
import LoadingComponent from "@/components/Core/LoadingComponent";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DoneIcon from '@mui/icons-material/Done';
import SelectAutoCompleteForFarms from "@/components/Core/selectDropDownForFarms";
import { removeOneElement, removeTheFilesFromStore, storeFilesArray } from "@/Redux/Modules/Farms";
import SelectAutoCompleteForCrops from "@/components/Core/SelectComponentForCrops";
import timePipe from "@/pipes/timePipe";


const FileUploadComponent = () => {

    const router = useRouter();
    const dispatch = useDispatch();

    const filesFromStore = useSelector((state: any) => state.farms?.filesList);

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [fileSize, setFileSize] = useState<any>()
    const [uploadintoChuncks, setUploadIntoChuncks] = useState<any>()
    const [uploadId, setUploadId] = useState<any>()
    const [presignedUrls, sestPresignedUrls] = useState<any>()
    const [progress, setProgress] = useState<any>(2)
    const [openCamera, setOpenCamera] = useState<any>(false)
    const [loading, setLoading] = useState<any>(false)
    const [multipleFiles, setMultipleFiles] = useState<any>()
    const [fileIndex, setIndex] = useState<any>()
    const [fileProgress, setFileProgress] = useState<number[] | any>();
    const [defaultValue, setDefaultValue] = useState<any>('');
    const [formId, setFormId] = useState<any>()
    const [formOptions, setFarmOptions] = useState<any>()
    const [selectedCrop, setSelectedCrop] = useState<any>()
    const [cropOptions, setCropOptions] = useState<any>()
    const [description, setDescription] = useState<any>()
    const [attachments, setAttachments] = useState<any>([])
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState(false);
    const [previewImages, setPreviewImages] = useState<any>([])
    console.log(previewImages)

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);



    let tempFilesStorage: any = [...attachments]

    let previewStorage = [...previewImages]

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
        dispatch(removeOneElement(index))

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
        dispatch(removeOneElement(index))

    };

    const getFormDetails = async (id: any) => {
        let response = await getAllFarmsService(accessToken);

        try {
            if (response?.success && response.data.length) {
                setFarmOptions(response?.data);
                if (id) {
                    let selectedObject = response?.data?.length && response?.data.find((item: any) => item._id == id);
                    setDefaultValue(selectedObject.title)
                    captureFarmName(selectedObject);
                }
            } else {
                setFarmOptions([]);
            }
        } catch (err) {
            console.error(err);

        }
    }
    //get all crops name
    const getCropsDetails = async (id: string) => {

        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/${id}/crops/list`, { method: "GET" });
            let responseData: any = await response.json();

            if (responseData.success == true) {
                if (responseData.data.length == 1) {
                    setCropOptions(responseData?.data);
                    setCropName(responseData?.data[0].title)
                    setSelectedCrop(responseData?.data[0])

                } else {
                    setCropOptions(responseData?.data);

                }

            } else {
                setCropOptions([]);
            }
        } catch (err) {
            console.error(err);

        }
    }

    const previewImagesEvent = (file: any, index: any) => {
        if (file) {
            const reader = new FileReader();

            reader.onload = (e: any) => {
                previewStorage.splice(1, 0, { fileIndex: file.name, prieviewUrl: e.target.result })
                setPreviewImages(previewStorage);
            };

            reader.readAsDataURL(file);
        } else {
            setPreviewImages(null);
        }
    }

    //video previw event
    let videoRef: any = useRef(null);

    const generateThumbnail = (file: any, index: any) => {
        console.log(file, "iji")

        if (file) {
            const reader = new FileReader();

            reader.onload = async (e: any) => {
                const videoDataUrl = e.target.result;

                // Create a video element dynamically
                const video = document.createElement('video');
                video.src = videoDataUrl;
                video.preload = 'auto';

                // Ensure metadata is loaded before capturing a frame
                video.addEventListener('canplay', () => {
                    const canvas: any = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

                    const thumbnailUrl = canvas.toDataURL();
                    console.log(thumbnailUrl)
                    previewStorage.splice(1, 0, { fileIndex: file.name, prieviewUrl: thumbnailUrl })
                    setPreviewImages(previewStorage);
                    video.remove();

                });

                // Start loading the video metadata
            };

            reader.readAsDataURL(file);
        }
    };



    //select the when input select 
    const handleFileChange = async (e: any) => {
        let copy = [...e.target.files, ...filesFromStore]
        dispatch(storeFilesArray(e.target.files))

        setMultipleFiles(copy)

        const fileProgressCopy = [...new Array(e.target.files?.length).fill(0)]; // Create a copy of the progress array
        let temp = [...fileProgressCopy, ...new Array(filesFromStore?.length).fill(100)]
        setFileProgress(temp)




        Array.from(e.target.files).map(async (item: any, index: number) => {
            if (item.type.slice(0, 4) == "vide") {
                generateThumbnail(item, item.name)
            }
            if (item.type.slice(0, 4) == "imag") {
                previewImagesEvent(item, item.name)
            }


            setIndex(index)
            setSelectedFile(item);
            setFileSize(item.size);
            const bytesToMB = (bytes: any) => {
                return bytes / (1024 * 1024);
            }
            if (bytesToMB(item.size) >= 5) {
                setUploadIntoChuncks(true)
                await startUploadEvent(item, index, temp, setFileProgress)
            }
            else {
                setUploadIntoChuncks(false)
                await fileUploadEvent(item, index, temp, setFileProgress)
            }
        })
    };


    //start the file upload event
    const startUploadEvent = async (file: any, index: any, fileProgressCopy: number[], setFileProgress: Function) => {
        let obj = {
            "attachment": {
                original_name: file.name,
                farm_id: formId,
                type: file.type,
                crop_slug: selectedCrop?.slug,
                source: "scouting"
            }
        }
        let options = {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json',
                'authorization': accessToken
            }),

            body: JSON.stringify(obj)

        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/attachments/start-upload`, options);
            let responseData = await response.json();
            if (responseData.success == true) {
                console.log(responseData)
                setUploadId(responseData.data.upload_id)
                await uploadFileintoChuncks(responseData.data.upload_id, file, index, fileProgressCopy, setFileProgress, responseData.data.file_key)
                tempFilesStorage.splice(1, 0, { original_name: responseData.data.original_name, type: file.type, size: file.size, name: responseData.data.name, crop_slug: responseData.data.crop_slug, path: responseData.data.path })
                setAttachments(tempFilesStorage)
            }
        }
        catch (err) {
            console.log(err)
        }

    }

    //file upload into multipart
    const uploadFileintoChuncks = async (uploadid: any, file: any, index: any, fileProgressCopy: number[], setFileProgress: Function, key: any) => {

        console.log(file)
        const chunkSize = 5 * 1024 * 1024; // 1MB chunks (you can adjust this as needed)
        const totalChunks = Math.ceil(file.size / chunkSize);
        const formData = new FormData();
        let resurls;

        let obj = {
            file_key: key,
            upload_id: uploadid,
            parts: totalChunks
        }
        let options = {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(obj)

        }

        try {
            // Send the chunk to the server using a POST request
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/attachments/start-upload/presigned-url`, options);
            let responseData: any = await response.json();
            if (responseData.success == true) {

                sestPresignedUrls(responseData.url)
                resurls = [...responseData.url]

                const promises = []

                for (let currentChunk = 0; currentChunk < totalChunks; currentChunk++) {
                    const start = currentChunk * chunkSize;
                    const end = Math.min(start + chunkSize, file.size);
                    const chunk = file.slice(start, end);

                    // promises.push(axios.put(resurls[currentChunk], chunk))
                    let response: any = await fetch(resurls[currentChunk], {
                        method: 'PUT',
                        body: chunk,
                    });

                    const progress = ((currentChunk + 1) / totalChunks) * 100;

                    promises.push(response)

                    fileProgressCopy[index] = progress;
                    setFileProgress([...fileProgressCopy]);
                }



                let promiseResponseObj = promises.map((part: any, index: any) => ({
                    ETag: part.headers.get('Etag').replace(/"/g, ''),
                    PartNumber: index + 1
                }))
                await mergeFileChuncksEvent(promiseResponseObj, uploadid, key, index)

            }


        } catch (error) {
            console.error('Error uploading chunk:', error);
        }

    }


    //last part of the file upload (merge all presigned urls)
    const mergeFileChuncksEvent = async (responseObjs: any, uploadid: any, file: any, index: any) => {

        let obj = {
            file_key: file,
            upload_id: uploadid,
            parts: responseObjs
        }

        let options = {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(obj)

        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/attachments/complete-upload`, options);
            let responseData: any = await response.json();

        }
        catch (err) {
            console.log(err)
        }

    }


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
                farm_id: formId
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
                console.log(responseData, "dd")
                let preSignedResponse = await fetch(responseData.data.target_url, { method: "PUT", body: item });
                fileProgressCopy[index] = 100;
                setFileProgress([...fileProgressCopy]);
                tempFilesStorage.splice(1, 0, { original_name: responseData.data.original_name, type: item.type, size: item.size, name: responseData.data.name, crop_slug: responseData.data.crop_slug, path: responseData.data.path })
                setAttachments(tempFilesStorage)

            }

        }
        catch (err) {
            console.log(err)
        }

    }

    useEffect(() => {
        if (router.query.farm_id) {
            getFormDetails(router.query.farm_id)
        }
    }, [accessToken, router.query.farm_id])



    const addScoutDetails = async () => {

        console.log(tempFilesStorage, 'opop');

        setLoading(true)
        let obj = {
            "farm_id": formId,
            "description": description,
            "attachments": tempFilesStorage,
            "crop_id": selectedCrop?._id
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
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts`, options);
            let responseData = await response.json();
            if (responseData.success == true) {
                dispatch(removeTheFilesFromStore([]));
                setAlertMessage(responseData.message)
                setAlertType(true)
                router.push(`/farms/${router.query.farm_id}/crops`)

            }
            setLoading(false)

        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    //onClose camera
    const captureCloseCamera = (value: any, file: any) => {
        if (value == true) {
            setOpenCamera(false)
        }
        else {
            setOpenCamera(false)
            let fileAfterconevert = base64ToFile(file, `capture${Math.floor(Math.random() * 100) + 1}_image${timePipe(new Date(), "DD-MM-YY")}.jpeg`, "image/jpeg")
            previewImagesEvent(fileAfterconevert, 0)
            let temp1: any = [fileAfterconevert]
            let copy = [...temp1, ...filesFromStore]
            setMultipleFiles(copy)
            const fileProgressCopy = [...new Array(temp1?.length).fill(0)]; // Create a copy of the progress array
            let temp = [...fileProgressCopy, ...new Array(filesFromStore?.length).fill(100)]
            setFileProgress(temp)
            fileUploadEvent(fileAfterconevert, 0, temp, setFileProgress)
            dispatch(storeFilesArray(temp1))
        }
    }
    //capture vedio
    const captureCameraVedio = (value: any, videofile: any) => {
        setOpenCamera(false)
        const type = "video/webm"
        const file = new File([videofile], `my video.webm`, { type });
        let temp1: any = [file]
        let copy = [...temp1, ...filesFromStore]
        setMultipleFiles(copy)
        const fileProgressCopy = [...new Array(temp1?.length).fill(0)]; // Create a copy of the progress array
        let temp = [...fileProgressCopy, ...new Array(filesFromStore?.length).fill(100)]
        setFileProgress(temp)
        dispatch(storeFilesArray(temp1))

        const bytesToMB = (bytes: any) => {
            return bytes / (1024 * 1024);
        }
        if (bytesToMB(file.size) >= 5) {
            setUploadIntoChuncks(true)
            startUploadEvent(file, 0, temp, setFileProgress)
        }
        else {
            setUploadIntoChuncks(false)
            fileUploadEvent(file, 0, temp, setFileProgress)
        }

    }

    const captureFarmName = (selectedObject: any) => {
        if (selectedObject) {
            setFormId(selectedObject?._id);
            getCropsDetails(selectedObject?._id)

        }
    }

    const [cropName, setCropName] = useState<any>()

    const captureCropName = (selectedObject: any) => {
        console.log(selectedObject)
        if (selectedObject) {
            setSelectedCrop(selectedObject)
            setCropName(selectedObject.title)
        }
    }


    return (
        <div >
            {openCamera == true ?
                <Camera openCamera={openCamera} captureCloseCamera={captureCloseCamera} captureCameraVedio={captureCameraVedio} /> :

                <div>
                    < Header1 name={"Add item"} router={`/farms/${router.query.farm_id}/crops`} />
                    <div className={styles.addscout} id="add-scout">
                        <div className={styles.scoutdetails} id="scout-details">
                            <div className={styles.addscoutdetails} id="add-scout-details">
                                <div className={styles.farmselection} id="farm-selection">
                                    <h5 className={styles.label} id="label-select-farm">
                                        Select Farm
                                    </h5>
                                    <FormControl
                                        className={styles.selectfarm}
                                        variant="outlined"
                                    >
                                        <InputLabel color="primary" />
                                        <SelectAutoCompleteForFarms options={formOptions} label={"title"} onSelectValueFromDropDown={captureFarmName} placeholder={"Select Farm"} defaultValue={defaultValue} />

                                        <FormHelperText />
                                    </FormControl>
                                </div>
                                <div className={styles.inputField}>
                                    <h5 className={styles.label} id="label-select-farm">
                                        Select Crop
                                    </h5>
                                    <FormControl className={styles.dropdown} variant="outlined">
                                        <InputLabel color="primary" />
                                        <SelectAutoCompleteForCrops options={cropOptions} label={"title"} onSelectValueFromDropDown={captureCropName} placeholder={"Select Crop"} defaultValue={cropName} />
                                        <FormHelperText />
                                    </FormControl>
                                </div>
                                <div className={styles.farmselection} id="images">
                                    <div className={styles.inputField}>
                                        <div className={styles.label1}></div>
                                    </div>

                                    <div className={styles.farmselection} id="images">
                                        <div className={styles.inputField}>
                                            <div className={styles.label1}>Images</div>
                                        </div>
                                        <div className={styles.imagesupload} id="images-upload">
                                            <div
                                                className={styles.captureimage}
                                                id="capture-image"
                                            >
                                                <div className={styles.camera}>
                                                    <img
                                                        className={styles.camera1Icon}
                                                        alt=""
                                                        src="/camera-1.svg"
                                                        onClick={() => setOpenCamera(true)}
                                                    />

                                                    <div className={styles.capture}> Capture </div>
                                                </div>
                                            </div>
                                            <div

                                                id="capture-image"
                                            >
                                                <div className={styles.uploadimage}>
                                                    <label >
                                                        <img
                                                            alt=""
                                                            src="/upload-image-icon.svg"
                                                        />
                                                        <input
                                                            type="file"
                                                            alt="images-upload"
                                                            multiple
                                                            onChange={handleFileChange}
                                                            hidden
                                                        />
                                                    </label>

                                                    <div className={styles.capture}> Upload </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {multipleFiles && Array?.from(multipleFiles).map((item: any, index: any) => (
                            <div className={styles.uploadprogress} id="upload-progress" key={index}>
                                <div className={styles.progress} id="progress">
                                    <img className={styles.image21} alt="" src={previewImages.find((e: any) => e.fileIndex == item.name)?.prieviewUrl ? previewImages.find((e: any) => e.fileIndex == item.name).prieviewUrl : "/nj.jpg"
                                    } />
                                    <div className={styles.progressdetails}>
                                        <div className={styles.uploaddetails}>
                                            <div className={styles.uploadcontroller}>
                                                <div className={styles.uploadname}>
                                                    <div className={styles.uploadItem}>
                                                        <div className={styles.photojpg}>{item.name?.slice(0, 10)}....{item.type} </div>
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
                        < div className={styles.scoutdescription} id="scout-description">
                            <div className={styles.descriptionblock}>
                                <div className={styles.addscoutdetails}>
                                    <div className={styles.inputField}>
                                        <div className={styles.farmselection} id="input-description">
                                            <div className={styles.label1}>Description</div>
                                            <TextField
                                                className={styles.input}
                                                color="primary"
                                                name="desciption"
                                                id="description"
                                                rows={4}
                                                maxRows={4}
                                                placeholder="Enter your description here"
                                                fullWidth={true}
                                                variant="outlined"
                                                multiline
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                sx={{ background: "#fff" }}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className={styles.footeractionbuttons} id="footer-buttons">
                                    <div className={styles.buttons} id="buttons">
                                        <Button
                                            className={styles.back}
                                            sx={{ width: 130 }}
                                            color="primary"
                                            name="back"
                                            id="back"
                                            size="large"
                                            variant="outlined"
                                            onClick={() => router.push(`/farms/${router.query.farm_id}/crops`)}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            className={styles.submit}
                                            color="primary"
                                            name="submit"
                                            id="submit"
                                            size="large"
                                            variant="contained"
                                            onClick={addScoutDetails}
                                            endIcon={<Icon>arrow_forward_sharp</Icon>}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
            <LoadingComponent loading={loading} />
        </div >


    )
}
export default FileUploadComponent;