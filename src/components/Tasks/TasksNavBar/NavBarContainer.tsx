import { FunctionComponent, memo, useState, useCallback } from "react";
import {
  Button,
  Icon,
  TextField,
  InputAdornment,
} from "@mui/material";
import SelectBox from "./SelectBox";
import PortalPopup from "./PortalPopup";
import styles from "./NavBarContainer.module.css";

const NavBarContainer: FunctionComponent = memo(() => {
  const [isSelectBoxOpen, setSelectBoxOpen] = useState(false);

  const openSelectBox = useCallback(() => {
    setSelectBoxOpen(true);
  }, []);

  const closeSelectBox = useCallback(() => {
    setSelectBoxOpen(false);
  }, []);

  const onButtonAddTaskClick = useCallback(() => {
    // Please sync "Add task" to the project
  }, []);

  return (
    <>
      <div className={styles.navbarcontainer}>
        <div className={styles.pagetitle}>
          <img className={styles.note1Icon} alt="" src="/note-11.svg" />
          <h1 className={styles.taskManagement}>{`Task Management`}</h1>
        </div>
        <div className={styles.headeractions}>
          <Button
            className={styles.filter}
            color="primary"
            variant="outlined"
            onClick={openSelectBox}
          >
            Filter
          </Button>
          <TextField
            className={styles.searchbar}
            color="primary"
            size="small"
            placeholder="Search Here"
            sx={{ width: 428 }}
            variant="outlined"
            type="search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>search_sharp</Icon>
                </InputAdornment>
              ),
            }}
          />
          <Button
            className={styles.filter}
            color="primary"
            size="small"
            variant="contained"
            startIcon={<Icon>arrow_forward_sharp</Icon>}
            onClick={onButtonAddTaskClick}
          >
            Add
          </Button>
        </div>
      </div>
      {isSelectBoxOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeSelectBox}
        >
          <SelectBox onClose={closeSelectBox} />
        </PortalPopup>
      )}
    </>
  );
});

export default NavBarContainer;
