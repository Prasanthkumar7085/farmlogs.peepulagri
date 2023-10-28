import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import TagsTextFeild from "./TagsTextFeild";
import styles from "./TagsDrawer.module.css";
import Image from "next/image";
import { Markup } from "interweave";
import timePipe from "@/pipes/timePipe";
import SellIcon from "@mui/icons-material/Sell";
const ShowMoreInViewAttachmentDetails = ({
  showMoreSuggestions,
  setShowMoreSuggestions,
  item,
  captureTagsDetailsEdit,
  loading,
}: any) => {
  function processString(inputString: string) {
    // let trimmedString = inputString.trim();
    // let regex = /^\d+\.\s*/;
    // if (regex.test(trimmedString)) {
    //   trimmedString = trimmedString.replace(regex, "");
    // }

    // return trimmedString;

    //// dots for i. a. 1.
    let trimmedString = inputString.trim();

    let regex = /^(?:\d+\.|\w+\.\s*)/;
    if (regex.test(trimmedString)) {
      trimmedString = trimmedString.replace(regex, "");
    }

    return trimmedString;
  }

  //function to formatext
  function formatText(input: any) {
    input = input?.replace(/\/n/g, "\n");

    if (/\d+\./.test(input) || /[a-z]\./i.test(input)) {
      let lines = input.split("\n");
      let output = "";

      lines.forEach((line: any) => {
        let updatedLine = line.trim();
        let regex = /^(?:\d+\.|\w+\.\s*)/;
        if (regex.test(updatedLine)) {
          output += `\u2022 ${processString(line)}\n`;
        } else {
          output += `${line}\n`;
        }
      });
      return output;
    } else {
      return input;
    }
  }
  return (
    <Drawer
      anchor={"bottom"}
      open={showMoreSuggestions}
      sx={{
        zIndex: "1300 !important",
        "& .MuiPaper-root": {
          height: "400px",
          overflowY: "auto",
          padding: "0 1rem 1rem",
          borderRadius: "20px 20px 0 0",
          background: "#F5F7FA",
        },
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Details</Typography>
          <IconButton
            onClick={() => {
              setShowMoreSuggestions(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div>
          {item ? (
            <div className={styles.cropDetailsBlock}>
              <Typography variant="caption" display="block" align="left">
                {timePipe(item?.time, "DD-MM-YYYY hh:mm a")}
              </Typography>
              <div className={styles.tagNames}>
                {item?.tags.length ? (
                  <Chip
                    className={styles.tagsLabel}
                    icon={<SellIcon sx={{ fontSize: 15 }} />}
                    label="Tags"
                    variant="outlined"
                  />
                ) : (
                  ""
                )}
                {item?.tags?.length
                  ? item?.tags?.map((item: string, index: number) => {
                      return (
                        <Chip
                          key={index}
                          label={item}
                          className={styles.tagsName}
                          variant="outlined"
                        />
                      );
                    })
                  : ""}
              </div>
              {item?.description ? (
                <Typography variant="h6" style={{ color: "orange" }}>
                  Findings
                </Typography>
              ) : (
                ""
              )}

              <Typography className={styles.findingsText}>
                {item?.description?.length ? (
                  <Markup content={formatText(item?.description)} />
                ) : (
                  ""
                )}
              </Typography>

              {item?.suggestions ? (
                <div>
                  <Typography variant="h6" style={{ color: "orange" }}>
                    Recomendations
                  </Typography>
                  <Typography className={styles.findingsText}>
                    <Markup content={item?.suggestions} />
                  </Typography>
                </div>
              ) : (
                ""
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton>
                  <Image
                    src={"/add-tag-icon.svg"}
                    width={20}
                    height={20}
                    alt="pp"
                  />
                </IconButton>
                <IconButton>
                  <Image
                    src={"/comment-white-icon.svg"}
                    width={20}
                    height={20}
                    alt="pp"
                  />
                </IconButton>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ShowMoreInViewAttachmentDetails;
