import type { NextPage } from "next";
import styles from "./description-container.module.css";
import { IconButton, TextField } from "@mui/material";
import { Markup } from "interweave";
import { useSelector } from "react-redux";

const DescriptionContainer = ({
  description,
  editField,
  editFieldOrNot,
  data,
  setEditField,
  setEditFieldOrNot,
  onUpdateField,
  setDescription,
  status
}: any) => {

  const loggedInUserId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );

  const getDescriptionData = (description: string) => {
    let temp = description.slice(0, 1).toUpperCase() + description.slice(1);
    let stringWithActualNewLine = temp.replace(/\n/g, "<br/>");
    return stringWithActualNewLine;
  };

  return (
    <div className={styles.descriptioncontainer}>
      <label className={styles.description}>Description</label>
      <div style={{ width: "100%" }}>
        {editField == "description" && editFieldOrNot ? (
          <TextField
            multiline
            minRows={4}
            maxRows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#45A845 !important",
                borderRadius: "8px !important",
              },
            }}
            placeholder="Enter description here"
          />
        ) : (
          <div
            onClick={() => {
              if (
                status !== "DONE" &&
                loggedInUserId == data?.created_by?._id
              ) {
                setEditFieldOrNot(true);
                setEditField("description");
              }
            }}
          >
            <p className={styles.descriptionText} style={{ cursor: "pointer" }}>
              {data?.description?.trim() ? (
                <Markup content={getDescriptionData(data?.description)} />
              ) : (
                "-"
              )}
            </p>
          </div>
        )}
        {editField == "description" && editFieldOrNot ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "0.5rem",
              width: "100%",
              marginTop: "1rem",
            }}
          >
            <IconButton
              sx={{ padding: "0" }}
              onClick={() => {
                setEditField("");
                setEditFieldOrNot(false);
              }}
            >
              <img src="/viewTaskIcons/cancel-icon.svg" alt="" width={"20px"} />
            </IconButton>

            <IconButton
              sx={{ padding: "0" }}
              onClick={() => {
                onUpdateField({});
              }}
            >
              <img
                src="/viewTaskIcons/confirm-icon.svg"
                alt=""
                width={"20px"}
              />
            </IconButton>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default DescriptionContainer;
