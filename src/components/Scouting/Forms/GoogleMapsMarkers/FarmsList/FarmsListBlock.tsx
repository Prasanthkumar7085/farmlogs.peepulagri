import {
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import styles from "./farmsBlock.module.css";
import { Clear } from "@mui/icons-material";
import FarmListCard from "./FarmListCard";
import { useEffect, useState } from "react";
import ListAllFarmForDropDownService from "../../../../../../lib/services/FarmsService/ListAllFarmForDropDownService";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import LoadingComponent from "@/components/Core/LoadingComponent";

interface ApiProps {
  page: number;
  searchString: string;
}

const FarmsListBlock = ({
  getFarmLocation,
  farmOptions,
  searchString,
  setSearchString,
}: any) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
            type="search"
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
        </div>
      </header>
      <div className={styles.listview}>
        <FarmListCard data={farmOptions} getFarmLocation={getFarmLocation} />
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
      <LoadingComponent loading={loading} />
    </div>
  );
};
export default FarmsListBlock;
