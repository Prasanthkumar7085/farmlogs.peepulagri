import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import Image from "next/image";
import styles from './TagsDrawer.module.css';
import { SummaryIcon } from "./SvgIcons/summaryIcon";
import { Markup } from "interweave";

const SummaryTextDilog = ({
  summaryDrawerClose,
  item,
  captureSummary,
}: any) => {
  console.log(item, "lllll");

  const [editorHtml, setEditorHtml] = useState("");


  const [data, setData] = useState(item?.summary ? item.summary : "");

  return (
    <Drawer anchor={"bottom"} open={true} sx={{
      '& .MuiPaper-root': {
        width: "100%",
        maxWidth: "500px",
        marginInline: "auto",
        minHeight: "300px"
      }
    }}>
      <div className={styles.drawerHeading}
      >
        <Typography variant='h6'>
          <SummaryIcon
          />
          <span>Day Summary</span></Typography>
        <IconButton
          onClick={() => {
            summaryDrawerClose(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      {item?.suggestions ?
        <div className={styles.drawerBody}>
          <div className={styles.findingDec}>
            <span className={styles.bodyHeading} style={{ color: "#3462CF" }}>Findings</span>
            <Typography variant="caption" className={styles.bodyDescrpiction}>
              <Markup content={data} />

            </Typography>
          </div>
          <div className={styles.findingDec}>
            <span className={styles.bodyHeading} style={{ color: "#F2A84C", fontWeight: "600 !important" }}>Recommandations</span>
            <Typography variant="caption" className={styles.bodyDescrpiction}>
              <Markup content={item?.suggestions} />
            </Typography>
          </div>
        </div>


        :
        <div className={styles.drawerBody}>
          <TextField
            color="primary"
            name="desciption"
            id="description"
            maxRows={4}
            minRows={4}
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
        </div>}
      <div className={styles.drawerFooter}>
        {!item?.suggestions &&
          <Button
            className={styles.submitBtnSuccess}
            sx={{}}
            variant="contained"
            onClick={() => {
              captureSummary(data);
              setData("");
            }}
            disabled={data ? false : true}
          >
            Submit
          </Button>}
      </div>
    </Drawer>
  );
};

export default SummaryTextDilog;
