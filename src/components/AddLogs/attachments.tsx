import type { NextPage } from "next";
import styles from "./attachments.module.css";
import { useState } from "react";
import { Button } from "@mui/material";
const Attachments = ({ onChangeFile, uploadFiles, files, setFiles }: any) => {

  console.log(files[0]);

  const deleteFile = (index: number) => {
    let array = [...files];
    let tempArray = array.filter((item: any, itemIndex: number) => itemIndex != index)

    setFiles(tempArray);
  }

  return (
    <div className={styles.attachments}>
      <div className={styles.header}>
        <h4 className={styles.title}>Attachments</h4>
        <p className={styles.description}>
          You can also drag and drop files to upload them.
        </p>
      </div>
      <input className={styles.link} type="file" multiple onChange={onChangeFile} />
      <div>
        {files &&
          Array.from(files).map((file: any, index) => (
            <div key={index} style={{ display: "flex", gap: '20px' }}>
              <div>
                {file.name}
              </div>
              <div onClick={() => deleteFile(index)}>X</div>
            </div>
          ))}
      </div>
      <Button disabled={!files?.length} onClick={uploadFiles}>
        Upload
      </Button>
    </div>
  );
};

export default Attachments;
