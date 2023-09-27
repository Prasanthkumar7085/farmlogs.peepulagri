import { Box, Button, FormControl, FormHelperText, Icon, InputLabel, LinearProgress, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";
import CameraCapture from "./Camera";
import Axios from "axios"
import styles from "./add-scout.module.css";
import Header1 from "../Header/HeaderComponent";
import SelectComponent from "@/components/Core/SelectComponent";
import { useSelector } from "react-redux";



const FileUploadComponent = () => {

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

    const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);



    const [cropOptions, setCropOptions] = useState<any>([
        { value: "Jini-2626(R)", title: "Jini-2626(R)" }
    ])

    //convert the kb into mb
    const bytesToMB = (bytes: any) => {
        return bytes / (1024 * 1024);
    }


    //select the when input select 
    const handleFileChange = async (e: any) => {

        setMultipleFiles(e.target.files)
        setFileProgress(new Array(e.target.files?.length).fill(0))
        const fileProgressCopy = [...new Array(e.target.files?.length).fill(0)]; // Create a copy of the progress array

        Array.from(e.target.files).map(async (item: any, index: number) => {
            setIndex(index)
            setSelectedFile(item);
            setFileSize(item.size);
            const bytesToMB = (bytes: any) => {
                return bytes / (1024 * 1024);
            }
            if (bytesToMB(item.size) >= 5) {
                setUploadIntoChuncks(true)
                await startUploadEvent(item, index, fileProgressCopy, setFileProgress)
            }
            else {
                setUploadIntoChuncks(false)
                await fileUploadEvent(item, index, fileProgressCopy, setFileProgress)
            }
        })
    };

    //start the file upload event
    const startUploadEvent = async (file: any, index: any, fileProgressCopy: number[], setFileProgress: Function) => {
        let obj = {
            file_name: file.name
        }
        let options = {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(obj)

        }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scouts/attachments/start-upload`, options);
            let responseData = await response.json();
            if (responseData.success == true) {
                console.log(responseData)
                setUploadId(responseData.uploadId)
                await uploadFileintoChuncks(responseData.uploadId, file, index, fileProgressCopy, setFileProgress)
            }
        }
        catch (err) {
            console.log(err)
        }

    }

    //file upload into multipart
    const uploadFileintoChuncks = async (uploadid: any, file: any, index: any, fileProgressCopy: number[], setFileProgress: Function) => {
        if (!file) {
            return;
        }

        const chunkSize = 5 * 1024 * 1024; // 1MB chunks (you can adjust this as needed)
        const totalChunks = Math.ceil(file.size / chunkSize);
        const formData = new FormData();
        let resurls;

        let obj = {
            file_name: file.name,
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
                await mergeFileChuncksEvent(promiseResponseObj, uploadid, file, index)

            }


        } catch (error) {
            console.error('Error uploading chunk:', error);
        }

    }


    //last part of the file upload (merge all presigned urls)
    const mergeFileChuncksEvent = async (responseObjs: any, uploadid: any, file: any, index: any) => {

        let obj = {
            file_name: file.name,
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
                "source": "scouts",
                "crop": "chilli"
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
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm/650a63d9760e446071bc08d7/attachments`, options);
            let responseData = await response.json();
            if (responseData.success == true) {
                console.log(responseData)
                let preSignedResponse = await fetch(responseData.data.target_url, { method: "PUT" });
                fileProgressCopy[index] = 100;
                setFileProgress([...fileProgressCopy]);
            }

        }
        catch (err) {
            console.log(err)
        }

    }

    //onClose camera
    const captureCloseCamera = (value: any, file: any) => {
        setOpenCamera(false)

    }




    return (
        <div>
            {openCamera == true ?
                <CameraCapture openCamera={openCamera} captureCloseCamera={captureCloseCamera} /> :

                <div>
                    < Header1 name={"Add item"} />
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
                                        <Select
                                            color="primary"
                                            name="select-farm"
                                            id="select-farm"
                                            size="medium"
                                        >
                                            <MenuItem value="Farm-1">Farm-1</MenuItem>
                                            <MenuItem value="Farm-2">Farm-2</MenuItem>
                                            <MenuItem value="Farm-3">Farm-3</MenuItem>
                                            <MenuItem value="Farm-4">Farm-4</MenuItem>
                                            <MenuItem value="Farm-5">Farm-5</MenuItem>
                                            <MenuItem value="Farm-6">Farm-6</MenuItem>
                                        </Select>
                                        <FormHelperText />
                                    </FormControl>
                                </div>
                                <div className={styles.inputField}>
                                    <FormControl className={styles.dropdown} variant="outlined">
                                        <InputLabel color="primary" />
                                        <SelectComponent options={cropOptions} color="primary" name="crops" id="crops" />

                                        <FormHelperText />
                                    </FormControl>
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
                                        <input
                                            className={styles.uploadimage}
                                            type="file"
                                            alt="images-upload"
                                            multiple
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {multipleFiles && Array?.from(multipleFiles).map((item: any, index: any) => (
                        <div className={styles.uploadprogress} id="upload-progress" key={index}>
                            <div className={styles.progress} id="progress">
                                <img className={styles.image21} alt="" src="/image-2-1.svg" />
                                <div className={styles.progressdetails}>
                                    <div className={styles.uploaddetails}>
                                        <div className={styles.uploadcontroller}>
                                            <div className={styles.uploadname}>
                                                <div className={styles.photojpg}>{item.name}</div>
                                                <div className={styles.photojpg}>{bytesToMB(item.size).toFixed(2)}MB</div>
                                            </div>
                                            <img
                                                className={styles.close41}
                                                alt=""
                                                src="/close-4-1.svg"
                                            />
                                        </div>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress variant="determinate" value={fileProgress[index]} />
                                        </Box>
                                    </div>
                                    <div className={styles.uploadstatus}>
                                        <div className={styles.completed}>{fileProgress[index]}%</div>

                                    </div>
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
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className={styles.footeractionbuttons} id="footer-buttons">
                                <div className={styles.buttons} id="buttons">
                                    <Button
                                        className={styles.input}
                                        sx={{ width: 130 }}
                                        color="primary"
                                        name="back"
                                        id="back"
                                        size="large"
                                        variant="outlined"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        className={styles.submitButton}
                                        color="primary"
                                        name="submit"
                                        id="submit"
                                        size="large"
                                        variant="contained"
                                        endIcon={<Icon>arrow_forward_sharp</Icon>}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </div >


    )
}
export default FileUploadComponent;