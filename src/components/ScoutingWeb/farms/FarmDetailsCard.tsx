import { FunctionComponent, useCallback } from "react";
import styles from "./FarmDetailsCard.module.css";
import { IconButton } from "@mui/material";

const ScoutingFarmDetailsCard: FunctionComponent = () => {
  const onFarmDetailsCardClick = useCallback(() => {
    // Please sync "Scouting" to the project
  }, []);

  const onViewClick = useCallback(() => {
    // Please sync "Scouting" to the project
  }, []);

  return (
    <div className={styles.farmCardGridContainer}>
      <div className={styles.farmdetailscard} onClick={onFarmDetailsCardClick}>
        <div className={styles.container}>
          <div className={styles.farmdetailscontainer}>
            <div className={styles.farmName}>
              <img className={styles.farmsIcon} alt="" src="/farmshape2.svg" />
              <h2 className={styles.farm1}>Farm-1</h2>
            </div>
            <div className={styles.landdetails}>
              <p className={styles.totalAcres}>
                Total <span>(acres)</span>
              </p>
              <p className={styles.text}>60</p>
            </div>
          </div>
          <div className={styles.timeline}>
            <img
              className={styles.calendarIcon}
              alt=""
              src="/farm-date-icon.svg"
            />
            <div className={styles.duration}>
              <p className={styles.from}>
                <span>09</span>, Jun 2023
              </p>
              <p className={styles.divider}>-</p>
              <p className={styles.from}>
                <span>24</span>, Jun 2023
              </p>
            </div>
          </div>
        </div>
        <div className={styles.actionbuttons}>
          <IconButton className={styles.view} onClick={onViewClick}>
            <img className={styles.trashXmark1Icon} alt="" src="/farm-view-icon.svg" />
          </IconButton>
          <IconButton className={styles.edit}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/edit-farm-icon.svg"
            />
          </IconButton>
          <IconButton className={styles.delete}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-delete-icon.svg"
            />
          </IconButton>
        </div>
      </div>
      <div className={styles.farmdetailscard} onClick={onFarmDetailsCardClick}>
        <div className={styles.container}>
          <div className={styles.farmdetailscontainer}>
            <div className={styles.farmName}>
              <img className={styles.farmsIcon} alt="" src="/farmshape2.svg" />
              <h2 className={styles.farm1}>Farm-1</h2>
            </div>
            <div className={styles.landdetails}>
              <p className={styles.totalAcres}>
                Total <span>(acres)</span>
              </p>
              <p className={styles.text}>60</p>
            </div>
          </div>
          <div className={styles.timeline}>
            <img
              className={styles.calendarIcon}
              alt=""
              src="/farm-date-icon.svg"
            />
            <div className={styles.duration}>
              <p className={styles.from}>
                <span>09</span>, Jun 2023
              </p>
              <p className={styles.divider}>-</p>
              <p className={styles.from}>
                <span>24</span>, Jun 2023
              </p>
            </div>
          </div>
        </div>
        <div className={styles.actionbuttons}>
          <IconButton className={styles.view} onClick={onViewClick}>
            <img className={styles.trashXmark1Icon} alt="" src="/farm-view-icon.svg" />
          </IconButton>
          <IconButton className={styles.edit}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/edit-farm-icon.svg"
            />
          </IconButton>
          <IconButton className={styles.delete}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-delete-icon.svg"
            />
          </IconButton>
        </div>
      </div>
      <div className={styles.farmdetailscard} onClick={onFarmDetailsCardClick}>
        <div className={styles.container}>
          <div className={styles.farmdetailscontainer}>
            <div className={styles.farmName}>
              <img className={styles.farmsIcon} alt="" src="/farmshape2.svg" />
              <h2 className={styles.farm1}>Farm-1</h2>
            </div>
            <div className={styles.landdetails}>
              <p className={styles.totalAcres}>
                Total <span>(acres)</span>
              </p>
              <p className={styles.text}>60</p>
            </div>
          </div>
          <div className={styles.timeline}>
            <img
              className={styles.calendarIcon}
              alt=""
              src="/farm-date-icon.svg"
            />
            <div className={styles.duration}>
              <p className={styles.from}>
                <span>09</span>, Jun 2023
              </p>
              <p className={styles.divider}>-</p>
              <p className={styles.from}>
                <span>24</span>, Jun 2023
              </p>
            </div>
          </div>
        </div>
        <div className={styles.actionbuttons}>
          <IconButton className={styles.view} onClick={onViewClick}>
            <img className={styles.trashXmark1Icon} alt="" src="/farm-view-icon.svg" />
          </IconButton>
          <IconButton className={styles.edit}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/edit-farm-icon.svg"
            />
          </IconButton>
          <IconButton className={styles.delete}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-delete-icon.svg"
            />
          </IconButton>
        </div>
      </div>
      <div className={styles.farmdetailscard} onClick={onFarmDetailsCardClick}>
        <div className={styles.container}>
          <div className={styles.farmdetailscontainer}>
            <div className={styles.farmName}>
              <img className={styles.farmsIcon} alt="" src="/farmshape2.svg" />
              <h2 className={styles.farm1}>Farm-1</h2>
            </div>
            <div className={styles.landdetails}>
              <p className={styles.totalAcres}>
                Total <span>(acres)</span>
              </p>
              <p className={styles.text}>60</p>
            </div>
          </div>
          <div className={styles.timeline}>
            <img
              className={styles.calendarIcon}
              alt=""
              src="/farm-date-icon.svg"
            />
            <div className={styles.duration}>
              <p className={styles.from}>
                <span>09</span>, Jun 2023
              </p>
              <p className={styles.divider}>-</p>
              <p className={styles.from}>
                <span>24</span>, Jun 2023
              </p>
            </div>
          </div>
        </div>
        <div className={styles.actionbuttons}>
          <IconButton className={styles.view} onClick={onViewClick}>
            <img className={styles.trashXmark1Icon} alt="" src="/farm-view-icon.svg" />
          </IconButton>
          <IconButton className={styles.edit}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/edit-farm-icon.svg"
            />
          </IconButton>
          <IconButton className={styles.delete}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-delete-icon.svg"
            />
          </IconButton>
        </div>
      </div>
      <div className={styles.farmdetailscard} onClick={onFarmDetailsCardClick}>
        <div className={styles.container}>
          <div className={styles.farmdetailscontainer}>
            <div className={styles.farmName}>
              <img className={styles.farmsIcon} alt="" src="/farmshape2.svg" />
              <h2 className={styles.farm1}>Farm-1</h2>
            </div>
            <div className={styles.landdetails}>
              <p className={styles.totalAcres}>
                Total <span>(acres)</span>
              </p>
              <p className={styles.text}>60</p>
            </div>
          </div>
          <div className={styles.timeline}>
            <img
              className={styles.calendarIcon}
              alt=""
              src="/farm-date-icon.svg"
            />
            <div className={styles.duration}>
              <p className={styles.from}>
                <span>09</span>, Jun 2023
              </p>
              <p className={styles.divider}>-</p>
              <p className={styles.from}>
                <span>24</span>, Jun 2023
              </p>
            </div>
          </div>
        </div>
        <div className={styles.actionbuttons}>
          <IconButton className={styles.view} onClick={onViewClick}>
            <img className={styles.trashXmark1Icon} alt="" src="/farm-view-icon.svg" />
          </IconButton>
          <IconButton className={styles.edit}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/edit-farm-icon.svg"
            />
          </IconButton>
          <IconButton className={styles.delete}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-delete-icon.svg"
            />
          </IconButton>
        </div>
      </div>
      <div className={styles.farmdetailscard} onClick={onFarmDetailsCardClick}>
        <div className={styles.container}>
          <div className={styles.farmdetailscontainer}>
            <div className={styles.farmName}>
              <img className={styles.farmsIcon} alt="" src="/farmshape2.svg" />
              <h2 className={styles.farm1}>Farm-1</h2>
            </div>
            <div className={styles.landdetails}>
              <p className={styles.totalAcres}>
                Total <span>(acres)</span>
              </p>
              <p className={styles.text}>60</p>
            </div>
          </div>
          <div className={styles.timeline}>
            <img
              className={styles.calendarIcon}
              alt=""
              src="/farm-date-icon.svg"
            />
            <div className={styles.duration}>
              <p className={styles.from}>
                <span>09</span>, Jun 2023
              </p>
              <p className={styles.divider}>-</p>
              <p className={styles.from}>
                <span>24</span>, Jun 2023
              </p>
            </div>
          </div>
        </div>
        <div className={styles.actionbuttons}>
          <IconButton className={styles.view} onClick={onViewClick}>
            <img className={styles.trashXmark1Icon} alt="" src="/farm-view-icon.svg" />
          </IconButton>
          <IconButton className={styles.edit}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/edit-farm-icon.svg"
            />
          </IconButton>
          <IconButton className={styles.delete}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-delete-icon.svg"
            />
          </IconButton>
        </div>
      </div>
      <div className={styles.farmdetailscard} onClick={onFarmDetailsCardClick}>
        <div className={styles.container}>
          <div className={styles.farmdetailscontainer}>
            <div className={styles.farmName}>
              <img className={styles.farmsIcon} alt="" src="/farmshape2.svg" />
              <h2 className={styles.farm1}>Farm-1</h2>
            </div>
            <div className={styles.landdetails}>
              <p className={styles.totalAcres}>
                Total <span>(acres)</span>
              </p>
              <p className={styles.text}>60</p>
            </div>
          </div>
          <div className={styles.timeline}>
            <img
              className={styles.calendarIcon}
              alt=""
              src="/farm-date-icon.svg"
            />
            <div className={styles.duration}>
              <p className={styles.from}>
                <span>09</span>, Jun 2023
              </p>
              <p className={styles.divider}>-</p>
              <p className={styles.from}>
                <span>24</span>, Jun 2023
              </p>
            </div>
          </div>
        </div>
        <div className={styles.actionbuttons}>
          <IconButton className={styles.view} onClick={onViewClick}>
            <img className={styles.trashXmark1Icon} alt="" src="/farm-view-icon.svg" />
          </IconButton>
          <IconButton className={styles.edit}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/edit-farm-icon.svg"
            />
          </IconButton>
          <IconButton className={styles.delete}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-delete-icon.svg"
            />
          </IconButton>
        </div>
      </div>
      <div className={styles.farmdetailscard} onClick={onFarmDetailsCardClick}>
        <div className={styles.container}>
          <div className={styles.farmdetailscontainer}>
            <div className={styles.farmName}>
              <img className={styles.farmsIcon} alt="" src="/farmshape2.svg" />
              <h2 className={styles.farm1}>Farm-1</h2>
            </div>
            <div className={styles.landdetails}>
              <p className={styles.totalAcres}>
                Total <span>(acres)</span>
              </p>
              <p className={styles.text}>60</p>
            </div>
          </div>
          <div className={styles.timeline}>
            <img
              className={styles.calendarIcon}
              alt=""
              src="/farm-date-icon.svg"
            />
            <div className={styles.duration}>
              <p className={styles.from}>
                <span>09</span>, Jun 2023
              </p>
              <p className={styles.divider}>-</p>
              <p className={styles.from}>
                <span>24</span>, Jun 2023
              </p>
            </div>
          </div>
        </div>
        <div className={styles.actionbuttons}>
          <IconButton className={styles.view} onClick={onViewClick}>
            <img className={styles.trashXmark1Icon} alt="" src="/farm-view-icon.svg" />
          </IconButton>
          <IconButton className={styles.edit}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/edit-farm-icon.svg"
            />
          </IconButton>
          <IconButton className={styles.delete}>
            <img
              className={styles.trashXmark1Icon}
              alt=""
              src="/farm-delete-icon.svg"
            />
          </IconButton>
        </div>
      </div>

    </div>
  );
};

export default ScoutingFarmDetailsCard;
