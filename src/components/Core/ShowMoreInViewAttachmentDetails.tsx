import timePipe from "@/pipes/timePipe";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SellIcon from "@mui/icons-material/Sell";
import { Chip, Divider, Drawer, IconButton, Typography } from "@mui/material";
import { Markup } from "interweave";
import "react-quill/dist/quill.snow.css";
import ImageComponent from "./ImageComponent";
import styles from "./TagsDrawer.module.css";
import formatText from "../../../lib/requestUtils/formatTextToBullets";
const ShowMoreInViewAttachmentDetails = ({
  showMoreSuggestions,
  setShowMoreSuggestions,
  item,
  captureTagsDetailsEdit,
  loading,
}: any) => {
  return (
    <Drawer
      anchor={"bottom"}
      open={showMoreSuggestions}
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "100vw",
          marginInline: "auto",
          minHeight: "300px",
          maxHeight: "600px",
          zIndex: "1300",
        },
      }}
    >
      <div className={styles.drawerHeading}>
        <Typography variant="h6">
          <InfoOutlinedIcon />
          <div>
            <span className={styles.title}>More Info</span>
            <Typography variant="caption" display="block" align="left">
              {timePipe(item?.created_at, "DD-MM-YYYY hh:mm a")}
            </Typography>
          </div>
        </Typography>
        <IconButton
          onClick={() => {
            setShowMoreSuggestions(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className={styles.scoutingdetails}>
        {item ? (
          <div className={styles.cropDetailsBlock}>
            {item?.tags?.length ? (
              <div className={styles.tagNames}>
                <Chip
                  className={styles.tagsLabel}
                  icon={
                    <SellIcon
                      sx={{ width: "12px", paddingInlineStart: "4px" }}
                    />
                  }
                  label="Tags"
                  size="small"
                  color="success"
                />

                {item?.tags?.length
                  ? item?.tags?.map((item: string, index: number) => {
                      return (
                        <Chip
                          key={index}
                          label={item}
                          className={styles.tagsName}
                          variant="outlined"
                          size="medium"
                          color="success"
                        />
                      );
                    })
                  : ""}
              </div>
            ) : (
              ""
            )}

            <div className={styles.drawerBody}>
              {item?.description ? (
                <div>
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
                      className={styles.bodyDescription}
                    >
                      <Markup content={formatText(item?.description)} />
                    </Typography>
                  </div>
                  <Divider />
                </div>
              ) : (
                ""
              )}
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
                  <span>Recommendations</span>
                </span>
                <Typography
                  variant="caption"
                  className={styles.bodyDescription}
                >
                  <Markup
                    content={
                      item?.suggestions
                        ? item?.suggestions
                        : "*No Recommendations added*"
                    }
                  />
                </Typography>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
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
