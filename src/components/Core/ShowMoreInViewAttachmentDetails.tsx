import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { SummaryIcon } from "./SvgIcons/summaryIcon";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import TagsTextFeild from "./TagsTextFeild";
import styles from "./TagsDrawer.module.css";
import Image from "next/image";
import { Markup } from "interweave";
import timePipe from "@/pipes/timePipe";
import SellIcon from "@mui/icons-material/Sell";
import ImageComponent from "./ImageComponent";
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
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "500px",
          marginInline: "auto",
          minHeight: "300px",
          maxHeight: "400px",
          zIndex: "1300",
        },
      }}
    >
      <div className={styles.drawerHeading}>
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
              {/* {item?.description ? (
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
              </Typography> */}
              <div className={styles.drawerHeading}>
                <Typography variant="h6">
                  <SummaryIcon />
                  <span>Summary</span>
                </Typography>
              </div>

              {item?.suggestions ? (
                <div className={styles.drawerBody}>
                  <div className={styles.findingDec}>
                    <span
                      className={styles.bodyHeading}
                      style={{ color: "#3462CF" }}
                    >
                      <ImageComponent
                        src={"/scouting/HasSummary.svg"}
                        height={19}
                        width={19}
                        alt="no-summary"
                      />
                      <span>Findings</span>
                    </span>
                    <Typography
                      variant="caption"
                      className={styles.bodyDescrpiction}
                    >
                      <Markup content={item?.desciption} />
                    </Typography>
                  </div>
                  <Divider />
                  <div className={styles.findingDec}>
                    <span
                      className={styles.bodyHeading}
                      style={{ color: "#05A155", fontWeight: "600 !important" }}
                    >
                      <ImageComponent
                        src={"/scouting/recommendations-icon.svg"}
                        height={16}
                        width={16}
                      />
                      <span>Recommendation</span>
                    </span>
                    <Typography
                      variant="caption"
                      className={styles.bodyDescrpiction}
                    >
                      <Markup content={item?.suggestions} />
                    </Typography>
                  </div>
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






















// import CloseIcon from "@mui/icons-material/Close";
// import {
//   Button,
//   Drawer,
//   IconButton,
//   TextField,
//   Typography,
//   Divider,
// } from "@mui/material";
// import { useState } from "react";

// import { Markup } from "interweave";
// import { SummaryIcon } from "./SvgIcons/summaryIcon";
// import styles from "./TagsDrawer.module.css";
// import ImageComponent from "@/components/Core/ImageComponent";

// const ShowMoreInViewAttachmentDetails = ({
//   summaryDrawerClose,
//   item,
//   captureSummary,
// }: any) => {
//   const [data, setData] = useState(item?.summary ? item.summary : "");

//   return (
//     <Drawer
//       anchor={"bottom"}
//       open={true}
//       sx={{
//         "& .MuiPaper-root": {
//           width: "100%",
//           maxWidth: "500px",
//           marginInline: "auto",
//           minHeight: "300px",
//           maxHeight: "400px",
//         },
//       }}
//     >
//       <div className={styles.drawerHeading}>
//         <Typography variant="h6">
//           <SummaryIcon />
//           <span>Summary</span>
//         </Typography>
//         <IconButton
//           onClick={() => {
//             summaryDrawerClose(false);
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </div>
//       {item?.suggestions ? (
//         <div className={styles.drawerBody}>
//           <div className={styles.findingDec}>
//             <span className={styles.bodyHeading} style={{ color: "#3462CF" }}>
//               <ImageComponent
//                 src={"/scouting/HasSummary.svg"}
//                 height={19}
//                 width={19}
//                 alt="no-summary"
//               />
//               <span>Findings</span>
//             </span>
//             <Typography variant="caption" className={styles.bodyDescrpiction}>
//               <Markup content={data} />
//             </Typography>
//           </div>
//           <Divider />
//           <div className={styles.findingDec}>
//             <span
//               className={styles.bodyHeading}
//               style={{ color: "#05A155", fontWeight: "600 !important" }}
//             >
//               <ImageComponent
//                 src={"/scouting/recommendations-icon.svg"}
//                 height={16}
//                 width={16}
//               />
//               <span>Recommendation</span>
//             </span>
//             <Typography variant="caption" className={styles.bodyDescrpiction}>
//               <Markup content={item?.suggestions} />
//             </Typography>
//           </div>
//         </div>
//       ) : (
//         <div className={styles.drawerBody}>
//           <TextField
//             color="primary"
//             name="desciption"
//             id="description"
//             maxRows={4}
//             minRows={4}
//             placeholder="Enter your findings here"
//             fullWidth={true}
//             variant="outlined"
//             multiline
//             value={data}
//             onChange={(e) => {
//               setData(e.target.value);
//             }}
//             sx={{ background: "#fff" }}
//           />
//         </div>
//       )}
//       <div className={styles.drawerFooter}>
//         {!item?.suggestions && (
//           <Button
//             className={styles.submitBtnSuccess}
//             sx={{}}
//             variant="contained"
//             onClick={() => {
//               captureSummary(data);
//               setData("");
//             }}
//             disabled={data ? false : true}
//           >
//             {item.summary ? "Update" : "Submit"}
//           </Button>
//         )}
//       </div>
//     </Drawer>
//   );
// };

// export default ShowMoreInViewAttachmentDetails;
 