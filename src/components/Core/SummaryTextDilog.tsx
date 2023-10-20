import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const SummaryTextDilog = ({
  summaryDrawerClose,
  scoutId,
  anchor,
  item,
  captureSummary,
}: any) => {
  console.log(item, "lllll");

  const [editorHtml, setEditorHtml] = useState("");

  const handleChange = (html: any) => {
    setEditorHtml(html);
  };
  const [data, setData] = useState(item?.summary ? item.summary : "");

  return (
    <Drawer anchor={"bottom"} open={true}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem",
          borderBottom: "1px solid #dddddd",
          width: anchor === "right" ? 600 : "",
        }}
      >
        <Typography>Day Summary</Typography>
        <IconButton
          onClick={() => {
            summaryDrawerClose(false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <div style={{ width: "100%", height: "200px" }}>
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
      <Button
        sx={{}}
        variant="contained"
        onClick={() => {
          captureSummary(data);
          setData("");
        }}
      >
        Submit
      </Button>
    </Drawer>
  );
};

export default SummaryTextDilog;
