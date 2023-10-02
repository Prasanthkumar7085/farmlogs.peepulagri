import { ChangeEvent, FunctionComponent, useCallback, useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import styles from "./FarmsNavBar.module.css";
import { useRouter } from "next/router";

export interface getFarmsData{
  getFarmsData : ({ search_string }: { search_string: string }) => void;
}
const FarmsNavBarWeb = ({ getFarmsData }: getFarmsData) => {
  
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [changed, setChanged] = useState(false);

  const onChangeSearchString = (e: ChangeEvent<HTMLInputElement>) => {
    setChanged(true);
    setSearch(e.target.value);
  }

  useEffect(() => {
    setSearch(router.query?.search_string as string);
  }, [router.query?.search_string]);
  
  useEffect(() => {
    if (changed) {
      const delay = 500;
      const debounce = setTimeout(() => {
        getFarmsData({ search_string: search });
      }, delay);
      return () => clearTimeout(debounce);
    }
  }, [search]);

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
          value={search}
          onChange={onChangeSearchString}
          // InputProps={{
          //   endAdornment: (
          //     <IconButton onClick={() => { }} size="small">
          //       <ClearIcon />
          //     </IconButton>
          //   ),
          // }}
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
        {/* <Button
          className={styles.button}
          variant="contained"
          onClick={onButtonClick}
        >
          <AddIcon sx={{ fontSize: "1rem" }} />Add
        </Button> */}
      </div>
    </div>
  );
};

export default FarmsNavBarWeb;
