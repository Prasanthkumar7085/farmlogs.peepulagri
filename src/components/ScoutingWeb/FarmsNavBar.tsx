import { FunctionComponent, useCallback } from "react";
import {
  TextField,
  Button,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import styles from "./FarmsNavBar.module.css";

const FarmsNavBarWeb: FunctionComponent = () => {
  const onButtonClick = useCallback(() => {
    // Please sync "Add Farm " to the project
  }, []);

  return (
    <div className={styles.farmsnavbar}>
      <div className={styles.title}>
        <img className={styles.farmIcon} alt="" src="/wer-farm-page-icon.svg" />
        <h1 className={styles.farms}>Farms</h1>
      </div>
      <div className={styles.actionsbar}>
        <TextField
          defaultValue="Sear"
          placeholder="Search by farm name"
          fullWidth
          variant="outlined"
          type="search"
          size="small"
          sx={{
            width: "350px",
            maxWidth: "350px",
            borderRadius: "4px",
            '& .MuiInputBase-root': {
              fontSize: "clamp(.875rem, 1vw, 1.125rem)",
              backgroundColor: "#fff",
              border: "none",

            },
          }}
        />
        <Button
          className={styles.button}
          variant="contained"
          onClick={onButtonClick}
        >
          <AddIcon sx={{ fontSize: "1rem" }} />Add
        </Button>
      </div>
    </div>
  );
};

export default FarmsNavBarWeb;
