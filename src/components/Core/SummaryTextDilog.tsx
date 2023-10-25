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

const SummaryTextDilog = ({
  summaryDrawerClose,
  item,
  captureSummary,
}: any) => {
  console.log(item, "lllll");

  const [editorHtml, setEditorHtml] = useState("");


  const [data, setData] = useState(item?.summary ? item.summary : "");

  return (
    <Drawer anchor={"bottom"} open={true}>
      <div className={styles.drawerHeading}
      >
        <Typography variant='h6'><Image
          alt={`image`}
          height={24}
          width={24}
          src="/summary-icon.svg"
          style={{ borderRadius: "5%" }}
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
      </div>
      <div className={styles.drawerFooter}>
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
        </Button>
      </div>
    </Drawer>
  );
};

export default SummaryTextDilog;
