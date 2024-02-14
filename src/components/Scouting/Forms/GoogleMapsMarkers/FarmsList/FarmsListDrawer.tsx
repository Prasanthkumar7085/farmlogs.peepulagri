import {
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import styles from "./farmsDrawer.module.css";
import { Clear } from "@mui/icons-material";
import FarmListCard from "./FarmListCard";
import { useEffect, useState } from "react";
import ListAllFarmForDropDownService from "../../../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

interface ApiProps {
  page: number;
  searchString: string;
}

const FarmsListBlock = ({ drawerOpen, setDrawerOpen }: any) => {
  const [loading, setLoading] = useState(false);
  const [farmOptions, setFarmOptions] = useState([]);
  const [searchString, setSearchString] = useState("");

  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const getFarmOptions = async ({ searchString }: Partial<ApiProps>) => {
    setLoading(true);
    let location_id = "";
    try {
      let response = await ListAllFarmForDropDownService(
        searchString as string,
        accessToken,
        location_id
      );
      if (response.success) {
        setFarmOptions(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && accessToken) {
      let delay = 500;
      let debounce = setTimeout(() => {
        getFarmOptions({ searchString: searchString });
      }, delay);
      return () => clearTimeout(debounce);
    }
  }, [router.isReady, accessToken, searchString]);

  useEffect(() => {
    if (accessToken && router.isReady) {
      getFarmOptions({});
    }
  }, []);

  return (
    <div className={styles.detailsslidebarfarmslist}>
      <header className={styles.header}>
        <div className={styles.headingcontainer}>
          <h2 className={styles.heading}>Farms</h2>
          <p className={styles.totalacres}>24.94 ha</p>
        </div>
        <div className={styles.actionsbar}>
          <TextField
            className={styles.searchbar}
            color="primary"
            size="medium"
            placeholder="Search farm"
            variant="outlined"
            value={searchString}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            }}
            sx={{ "& .MuiInputBase-root": { height: "32px" } }}
          />
          <Button
            disableElevation={true}
            color="primary"
            variant="contained"
            sx={{ borderRadius: "0px 0px 0px 0px" }}
          >
            Filter
          </Button>
          <Button
            disableElevation={true}
            color="primary"
            variant="contained"
            sx={{ borderRadius: "0px 0px 0px 0px" }}
          />
        </div>
      </header>
      <div className={styles.listview}>
        <FarmListCard data={farmOptions} />
      </div>
      <div className={styles.buttoncontainer}>
        <Button
          className={styles.addfarmbutton}
          disableElevation={true}
          color="success"
          variant="contained"
          sx={{ borderRadius: "0px 0px 0px 0px" }}
        >
          Add Farm
        </Button>
      </div>
    </div>
  );
};
export default FarmsListBlock;
