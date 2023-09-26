import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import CameraCapture from "./Camera";
import Axios from "axios"
import styles from "./add-scout.module.css";
import Header1 from "./Header/HeaderComponent";


const FileUploadComponent = () => {

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [fileSize, setFileSize] = useState<any>()
    const [uploadintoChuncks, setUploadIntoChuncks] = useState<any>()
    const [uploadId, setUploadId] = useState<any>()
    const [presignedUrls, sestPresignedUrls] = useState<any>()

    const handleFileChange = (e: any) => {
        setSelectedFile(e.target.files[0]);
        setFileSize(e.target.files[0].size);
        //file in mb
        const bytesToMB = (bytes: any) => {
            return bytes / (1024 * 1024);
        }
        if (bytesToMB(e.target.files[0].size) >= 5) {
            setUploadIntoChuncks(true)
        }
        else {
            setUploadIntoChuncks(false)
        }
    };

    const startUploadEvent = async () => {
        let obj = {
            file_name: selectedFile.name
        }
        let options = {
            method: "POST",
            headers: new Headers({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(obj)

        }
        try {
            let response = await fetch("http://localhost:3000/v1.0/scouts/attachments/start-upload", options);
            let responseData = await response.json();
            if (responseData.success == true) {
                console.log(responseData)
                setUploadId(responseData.uploadId)
                uploadFileintoChuncks(responseData.uploadId, selectedFile.name)
            }
        }
        catch (err) {
            console.log(err)
        }

    }

    //file upload into multipart
    const uploadFileintoChuncks = async (uploadid: any, file_name: any) => {
        if (!selectedFile) {
            return;
        }

        const chunkSize = 5 * 1024 * 1024; // 1MB chunks (you can adjust this as needed)
        const totalChunks = Math.ceil(selectedFile.size / chunkSize);
        const formData = new FormData();
        let resurls;

        let obj = {
            file_name: selectedFile.name,
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
            let response = await fetch(`http://localhost:3000/v1.0/scouts/attachments/start-upload/presigned-url`, options);
            let responseData: any = await response.json();
            if (responseData.success == true) {

                sestPresignedUrls(responseData.url)
                resurls = [...responseData.url]

                const promises = []

                for (let currentChunk = 0; currentChunk < totalChunks; currentChunk++) {
                    const start = currentChunk * chunkSize;
                    const end = Math.min(start + chunkSize, selectedFile.size);
                    const chunk = selectedFile.slice(start, end);

                    // promises.push(axios.put(resurls[currentChunk], chunk))
                    let response: any = await fetch(resurls[currentChunk], {
                        method: 'PUT',
                        body: chunk,
                    });

                    promises.push(response)
                    console.log(response.headers.get('Etag'))
                }


                let promiseResponseObj = promises.map((part: any, index: any) => ({
                    ETag: part.headers.get('Etag').replace(/"/g, ''),
                    PartNumber: index + 1
                }))
                mergeFileChuncksEvent(promiseResponseObj, uploadid)
                console.log(promiseResponseObj)

            }

        } catch (error) {
            console.error('Error uploading chunk:', error);
        }

    }

    const mergeFileChuncksEvent = async (responseObjs: any, uploadid: any) => {

        let obj = {
            file_name: selectedFile.name,
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
            let response = await fetch(`http://localhost:3000/v1.0/scouts/attachments/complete-upload`, options);
            let responseData: any = await response.json();
            console.log(responseData, "after")
        }
        catch (err) {
            console.log(err)
        }

    }







    //file upload 
    const fileUploadEvent = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        let options: any = {
            method: "POST",
            body: formData
        }

        try {
            // let response = await fetch("url", options);
            // let responseData = await response.json();
            // if (responseData) {
            //     let preSignedResponse = await fetch("", { method: "PUT" });
            // }
            console.log("lo")
        }
        catch (err) {
            console.log(err)
        }

    }


    return (
        <div>
            {/* <input type="file" onChange={handleFileChange} />
            {uploadintoChuncks == true ? <Button onClick={startUploadEvent}>Upload</Button> : <Button onClick={fileUploadEvent}>Upload</Button>} */}
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
                                        />
                                        <div className={styles.capture}>Capture</div>
                                    </div>
                                </div>
                                <input
                                    className={styles.uploadimage}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    alt="images-upload"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default FileUploadComponent;