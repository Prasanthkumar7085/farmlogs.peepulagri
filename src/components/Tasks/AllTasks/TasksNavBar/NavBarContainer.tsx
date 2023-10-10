import { Button, Icon, InputAdornment, TextField } from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./NavBarContainer.module.css";
import FarmAutoCompleteInAddTask from "../../AddTask/FarmAutoCompleteInAddTask";
import { useSelector } from "react-redux";
import getAllFarmsService from "../../../../../lib/services/FarmsService/getAllFarmsService";
import { FarmInTaskType } from "@/types/tasksTypes";

interface PropTypes {
  onChangeSearch: (search: string) => void;
  searchString: string;
  onSelectValueFromDropDown: (value: FarmInTaskType, reason: string) => void;
  selectedFarm: FarmInTaskType | null | undefined;
}

const NavBarContainer: React.FC<PropTypes> = ({
  onChangeSearch,
  searchString,
  onSelectValueFromDropDown,
  selectedFarm,
}) => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [farmOptions, setFarmOptions] = useState<Array<FarmInTaskType>>();
  const [selectedFarmOption, setSelectedFarmOption] = useState<
    FarmInTaskType | null | undefined
  >();

  useEffect(() => {
    setSearch(searchString);
  }, [searchString]);

  useEffect(() => {
    setSelectedFarmOption(selectedFarm);
  }, [selectedFarm]);

  const onButtonAddTaskClick = useCallback(() => {
    router.push("/tasks/add");
  }, []);

  const getAllFarms = async () => {
    setLoading(true);
    const response = await getAllFarmsService(accessToken);
    if (response?.success) {
      setFarmOptions(response?.data);
      if (router.query.farm_id) {
        let obj = response?.data?.find(
          (item: FarmInTaskType) => item?._id == router.query?.farm_id
        );
        setSelectedFarmOption(obj);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    if (router.isReady && accessToken) {
      getAllFarms();
    }
  }, [router.isReady, accessToken]);

  return (
    <>
      <div className={styles.navbarcontainer}>
        <div className={styles.pagetitle}>
          <img className={styles.note1Icon} alt="" src="/note-11.svg" />
          <h1 className={styles.taskManagement}>{`Task Management`}</h1>
        </div>
        <div className={styles.headeractions}>
          <FarmAutoCompleteInAddTask
            options={farmOptions}
            onSelectValueFromDropDown={onSelectValueFromDropDown}
            label={"title"}
            placeholder={"Select Farm here"}
            defaultValue={selectedFarmOption}
          />

          <TextField
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onChangeSearch(e.target.value);
            }}
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
    </>
  );
};

export default NavBarContainer;
