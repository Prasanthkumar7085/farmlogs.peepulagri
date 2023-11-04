import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
  Divider
} from "@mui/material";
import { useEffect, useState } from "react";

import { Markup } from "interweave";
import { SummaryIcon } from "./SvgIcons/summaryIcon";
import styles from "./TagsDrawer.module.css";
import ImageComponent from "@/components/Core/ImageComponent";

const SummaryTextDilog = ({
  summaryDrawerClose,
  item,
  captureSummary,
  SummaryDrawerOpen,
}: any) => {
  const [data, setData] = useState("");

  useEffect(() => {
    setData(item?.summary);
  }, [SummaryDrawerOpen]);
  return (
    <Drawer
      anchor={"bottom"}
      open={SummaryDrawerOpen}
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: "500px",
          marginInline: "auto",
          minHeight: "300px",
          maxHeight: "700px",
        },
      }}
    >
      <div className={styles.drawerHeading}>
        <Typography variant="h6">
          <SummaryIcon />
          <span>Summary</span>
        </Typography>
        <IconButton
          onClick={() => {
            summaryDrawerClose(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      {item?.suggestions ? (
        <div className={styles.drawerBody}>
          <div className={styles.findingDec}>
            <span className={styles.bodyHeading} style={{ color: "#3462CF" }}>
              <ImageComponent
                src={"/scouting/HasSummary.svg"}
                height={19}
                width={19}
                alt="no-summary"
              />
              <span>Findings</span>
            </span>
            <Typography variant="caption" className={styles.bodyDescrpiction}>
              <Markup content={data} />
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
              <span>Recommendations</span>
            </span>
            <Typography variant="caption" className={styles.bodyDescrpiction}>
              <Markup content={item?.suggestions} />
            </Typography>
          </div>
        </div>
      ) : (
        <div className={styles.drawerBody}>
          <TextField
            color="primary"
            name="desciption"
            id="description"
            maxRows={15}
            minRows={10}
            placeholder="Enter your findings here"
            fullWidth={true}
            variant="outlined"
            multiline
            value={data}
            onChange={(e) => {
              setData(e.target.value);
            }}
            sx={{ background: "#fff" }}
          />
        </div>
      )}
      <div className={styles.drawerFooter}>
        {!item?.suggestions && (
          <Button
            className={styles.submitBtnSuccess}
            sx={{}}
            variant="contained"
            onClick={() => {
              captureSummary(data);
            }}
            disabled={data ? false : true}
          >
            {item.summary ? "Update" : "Submit"}
          </Button>
        )}
      </div>
    </Drawer>
  );
};

export default SummaryTextDilog;
