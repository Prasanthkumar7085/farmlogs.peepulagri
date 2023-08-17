import type { NextPage } from "next";
import { TextField, InputAdornment, Icon, Button } from "@mui/material";
import FarmCard from "./farm-card";
import HeaderCell from "./header-cell";
import Row from "./row";
import SideBarMenu1 from "./side-bar-menu1";
import styles from "./dashboard.module.css";
const Dashboard: NextPage = () => {
  return (
    <main className={styles.dashboard}>
      <section className={styles.dashboard1}>
        <div className={styles.farmcardlists}>
          <FarmCard
            farmShape="/farmshape.svg"
            acresCount="60 Acres"
            farmName="Farm-1"
            totalLogs="Total Logs"
            barWidth="50%"
            para="09, Jun 2023 - Current"
          />
          <a className={styles.farmcard}>
            <div className={styles.farmcarddetails}>
              <img
                className={styles.farmshapeIcon}
                alt=""
                src="/farmshape1.svg"
              />
              <div className={styles.title}>
                <div className={styles.farmname}>Farm-2</div>
                <div className={styles.acrescount}>60 Acres</div>
              </div>
            </div>
            <div className={styles.duration}>
              <img
                className={styles.calendarIcon}
                alt=""
                src="/calendaricon1.svg"
              />
              <div className={styles.farmname}>08, Apr 2023 - Current</div>
            </div>
            <div className={styles.statsprogress}>
              <div className={styles.logscount}>
                <div className={styles.farmname}>Total Logs</div>
                <div className={styles.div}>80</div>
              </div>
              <div className={styles.progressbar}>
                <div className={styles.farmname}>Progress</div>
                <div className={styles.progress}>
                  <div className={styles.progressChild} />
                </div>
              </div>
            </div>
            <div className={styles.farmcardChild} />
          </a>
          <a className={styles.farmcard1}>
            <div className={styles.farmcarddetails1}>
              <img
                className={styles.farmshapeIcon1}
                alt=""
                src="/farmshape2.svg"
              />
              <div className={styles.title}>
                <div className={styles.farmname}>Farm-3</div>
                <div className={styles.acrescount}>60 Acres</div>
              </div>
            </div>
            <div className={styles.duration1}>
              <img
                className={styles.calendarIcon}
                alt=""
                src="/calendaricon1.svg"
              />
              <div className={styles.farmname}>05, Mar 2023 - 09, Aug 2023</div>
            </div>
            <div className={styles.statsprogress1}>
              <div className={styles.logscount}>
                <div className={styles.farmname}>Total Logs</div>
                <div className={styles.div1}>140</div>
              </div>
              <div className={styles.progressbar}>
                <div className={styles.farmname}>Progress</div>
                <div className={styles.progress1}>
                  <div className={styles.progressItem} />
                </div>
              </div>
            </div>
          </a>
          <a className={styles.farmcard1}>
            <div className={styles.farmcarddetails1}>
              <img
                className={styles.farmshapeIcon}
                alt=""
                src="/farmshape3.svg"
              />
              <div className={styles.title}>
                <div className={styles.farmname}>Farm-4</div>
                <div className={styles.acrescount}>60 Acres</div>
              </div>
            </div>
            <div className={styles.duration1}>
              <img
                className={styles.calendarIcon}
                alt=""
                src="/calendaricon1.svg"
              />
              <div className={styles.farmname}>01, Mar 2023 - Current</div>
            </div>
            <div className={styles.statsprogress1}>
              <div className={styles.logscount}>
                <div className={styles.totalLogsWrapper}>
                  <div className={styles.farmname}>Total Logs</div>
                </div>
                <div className={styles.wrapper}>
                  <div className={styles.div2}>80</div>
                </div>
              </div>
              <div className={styles.progressbar}>
                <div className={styles.farmname}>Progress</div>
                <div className={styles.progress}>
                  <div className={styles.progressInner} />
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className={styles.farmdashboarddetails}>
          <div className={styles.farmmap}>
            <div className={styles.map}>
              <div className={styles.image2Parent}>
                <img
                  className={styles.image2Icon}
                  alt=""
                  src="/image-2@2x.png"
                />
                <img className={styles.groupChild} alt="" src="/vector-6.svg" />
                <img className={styles.groupItem} alt="" src="/vector-1.svg" />
                <img className={styles.groupInner} alt="" src="/vector-2.svg" />
                <img className={styles.vectorIcon} alt="" src="/vector-5.svg" />
                <img
                  className={styles.groupChild1}
                  alt=""
                  src="/vector-3.svg"
                />
                <img
                  className={styles.groupChild2}
                  alt=""
                  src="/vector-4.svg"
                />
                <img
                  className={styles.groupChild3}
                  alt=""
                  src="/vector-7.svg"
                />
                <img
                  className={styles.groupChild4}
                  alt=""
                  src="/vector-8.svg"
                />
                <img
                  className={styles.groupChild5}
                  alt=""
                  src="/vector-9.svg"
                />
                <img
                  className={styles.groupChild6}
                  alt=""
                  src="/vector-10.svg"
                />
                <img
                  className={styles.groupChild7}
                  alt=""
                  src="/vector-11.svg"
                />
                <img
                  className={styles.groupChild8}
                  alt=""
                  src="/vector-12.svg"
                />
                <img
                  className={styles.groupChild9}
                  alt=""
                  src="/vector-131.svg"
                />
                <div className={styles.locationPopupWrapper}>
                  <div className={styles.locationPopup}>
                    <img
                      className={styles.location311}
                      alt=""
                      src="/location-3-1-11.svg"
                    />
                    <div className={styles.farm1}>Farm-1</div>
                  </div>
                </div>
              </div>
              <div className={styles.locationPopupContainer}>
                <div className={styles.locationPopup}>
                  <img
                    className={styles.location311}
                    alt=""
                    src="/location-3-1-12.svg"
                  />
                  <div className={styles.farm1}>Farm-1</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.header}>
            <h3 className={styles.title2}>Farms Dashboard</h3>
            <div className={styles.tablefilters}>
              <TextField
                className={styles.searchbar}
                color="primary"
                variant="outlined"
                type="text"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>search_sharp</Icon>
                    </InputAdornment>
                  ),
                }}
                label="Search by name, logs, resource "
                placeholder="Placeholder"
                size="medium"
                margin="none"
              />
              <Button
                variant="contained"
                color="success"
                startIcon={<Icon>arrow_forward_sharp</Icon>}
              >
                Add Logs
              </Button>
            </div>
          </div>
          <div className={styles.table}>
            <div className={styles.cell}>
              <HeaderCell
                itemStatus="Date"
                itemActionCode="/polygon-11.svg"
                itemIdentifier="/polygon-21.svg"
                showFrameDiv
                headerCellPosition="unset"
                headerCellWidth="142px"
                headerCellPadding="var(--padding-mini) var(--padding-3xs)"
                headerCellFlex="unset"
                statusColor="#fff"
              />
              <HeaderCell
                itemStatus="Title"
                itemActionCode="/polygon-11.svg"
                itemIdentifier="/polygon-21.svg"
                showFrameDiv
                headerCellPosition="unset"
                headerCellWidth="367px"
                headerCellPadding="var(--padding-mini) var(--padding-3xs)"
                headerCellFlex="unset"
                statusColor="#fff"
              />
              <HeaderCell
                itemStatus="Category"
                itemActionCode="/polygon-11.svg"
                itemIdentifier="/polygon-21.svg"
                showFrameDiv
                headerCellPosition="unset"
                headerCellWidth="160px"
                headerCellPadding="var(--padding-mini) var(--padding-3xs)"
                headerCellFlex="unset"
                statusColor="#fff"
              />
              <HeaderCell
                itemStatus="Work Type"
                itemActionCode="/polygon-11.svg"
                itemIdentifier="/polygon-21.svg"
                showFrameDiv
                headerCellPosition="unset"
                headerCellWidth="145px"
                headerCellPadding="var(--padding-mini) var(--padding-3xs)"
                headerCellFlex="unset"
                statusColor="#fff"
              />
              <HeaderCell
                itemStatus="Resources"
                itemActionCode="/polygon-1.svg"
                itemIdentifier="/polygon-2.svg"
                showFrameDiv={false}
                headerCellPosition="unset"
                headerCellWidth="213px"
                headerCellPadding="var(--padding-mini) var(--padding-3xs)"
                headerCellFlex="unset"
                statusColor="#fff"
              />
              <HeaderCell
                itemStatus="Manual Hours"
                itemActionCode="/polygon-1.svg"
                itemIdentifier="/polygon-2.svg"
                showFrameDiv={false}
                headerCellPosition="unset"
                headerCellWidth="140px"
                headerCellPadding="var(--padding-mini) var(--padding-3xs)"
                headerCellFlex="unset"
                statusColor="#fff"
              />
              <HeaderCell
                itemStatus="Machine Hours"
                itemActionCode="/polygon-1.svg"
                itemIdentifier="/polygon-2.svg"
                showFrameDiv={false}
                headerCellPosition="unset"
                headerCellWidth="140px"
                headerCellPadding="var(--padding-mini) var(--padding-3xs)"
                headerCellFlex="unset"
                statusColor="#fff"
              />
              <HeaderCell
                itemStatus="Action"
                itemActionCode="/polygon-1.svg"
                itemIdentifier="/polygon-2.svg"
                showFrameDiv={false}
                headerCellPosition="unset"
                headerCellWidth="unset"
                headerCellPadding="var(--padding-mini) var(--padding-3xs)"
                headerCellFlex="1"
                statusColor="#fff"
              />
            </div>
            <div className={styles.tableBody}>
              <Row
                data="09, Aug 2023"
                data1={`Regular cleaning of machinery & equipment`}
                soilPreparation="Equipment Mnt"
                data2="Machinery"
                man="/man1.svg"
                prop="2"
                women="/women1.svg"
                prop1="1"
                tractor1="/tractor-1.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="2"
                hours="0 Hours"
                hours1="10 Hours"
                eye11="/eye-1-11.svg"
                showMen={false}
                showWomen={false}
                showTrackor
                showSpray={false}
                rowPosition="unset"
                rowBackgroundColor="#f5f7fa"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="#6a7185"
                frameDivBorder="1px solid var(--body)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="#d94841"
                dataBackground="unset"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="08, Aug 2023"
                data1="Inspecting for signs of wear, rust, or damage"
                soilPreparation="Equipment Mnt"
                data2="Manual"
                man="/man1.svg"
                prop="2"
                women="/women1.svg"
                prop1="3"
                tractor1="/tractor-11.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="1"
                hours="10 Hours"
                hours1="0 Hours"
                eye11="/eye-1-11.svg"
                showMen
                showWomen
                showTrackor={false}
                showSpray={false}
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="#6a7185"
                frameDivBorder="1px solid var(--body)"
                frameDivAlignItems="flex-end"
                soilPreparationColor="#fff"
                dataColor="#5e9765"
                dataBackground="unset"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="06, Aug 2023"
                data1="Properly storing / transporting harvested crops"
                soilPreparation="Harvesting"
                data2="Both"
                man="/man1.svg"
                prop="1"
                women="/women1.svg"
                prop1="3"
                tractor1="/tractor-1.svg"
                prop2="1"
                pesticide1="/pesticide-11.svg"
                prop3="1"
                hours="20 Hours"
                hours1="24 Hours"
                eye11="/eye-1-11.svg"
                showMen
                showWomen={false}
                showTrackor
                showSpray
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="1px solid #05a155"
                frameDivBorder="1px solid var(--color-mediumseagreen-100)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="unset"
                dataBackground="linear-gradient(142.18deg, #3462cf, #2b53be)"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="05, Aug 2023"
                data1="Sorting and grading harvested produce"
                soilPreparation="Harvesting"
                data2="Both"
                man="/man2.svg"
                prop="2"
                women="/women1.svg"
                prop1="3"
                tractor1="/tractor-1.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="2"
                hours="13 Hours"
                hours1="24 Hours"
                eye11="/eye-1-12.svg"
                showMen
                showWomen={false}
                showTrackor
                showSpray
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="1px solid #05a155"
                frameDivBorder="1px solid var(--color-mediumseagreen-100)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="unset"
                dataBackground="linear-gradient(142.18deg, #3462cf, #2b53be)"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="05, Aug 2023"
                data1="Monitoring soil health improvements and pest reduction"
                soilPreparation="Crop Rotation"
                data2="Manual"
                man="/man2.svg"
                prop="2"
                women="/women1.svg"
                prop1="1"
                tractor1="/tractor-11.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="2"
                hours="15 Hours"
                hours1="0 Hours"
                eye11="/eye-1-12.svg"
                showMen
                showWomen
                showTrackor={false}
                showSpray={false}
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="1"
                frameDivBackgroundColor="1px solid #57b6f0"
                frameDivBorder="1px solid var(--color-deepskyblue)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="#5e9765"
                dataBackground="unset"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="03, Aug 2023"
                data1="Hand-weeding or using mechanized weeders"
                soilPreparation="Weeding"
                data2="Machinery"
                man="/man2.svg"
                prop="2"
                women="/women1.svg"
                prop1="1"
                tractor1="/tractor-1.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="2"
                hours="0 Hours"
                hours1="24 Hours"
                eye11="/eye-1-12.svg"
                showMen={false}
                showWomen={false}
                showTrackor
                showSpray
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="#d94841"
                frameDivBorder="1px solid var(--color-firebrick)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="#d94841"
                dataBackground="unset"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="02, Aug 2023"
                data1="Identifying weed species present"
                soilPreparation="Weeding"
                data2="Machinery"
                man="/man2.svg"
                prop="2"
                women="/women1.svg"
                prop1="1"
                tractor1="/tractor-1.svg"
                prop2="1"
                pesticide1="/pesticide-11.svg"
                prop3="1"
                hours="0 Hours"
                hours1="14 Hours"
                eye11="/eye-1-12.svg"
                showMen={false}
                showWomen={false}
                showTrackor
                showSpray
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="#d94841"
                frameDivBorder="1px solid var(--color-firebrick)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="#d94841"
                dataBackground="unset"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="01, Aug 2023"
                data1="Monitoring the effectiveness of treatments and reapplying"
                soilPreparation="Pest Mngt."
                data2="Both"
                man="/man2.svg"
                prop="2"
                women="/women1.svg"
                prop1="1"
                tractor1="/tractor-1.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="2"
                hours="12 Hours"
                hours1="16 Hours"
                eye11="/eye-1-12.svg"
                showMen
                showWomen={false}
                showTrackor
                showSpray
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="1"
                frameDivBackgroundColor="1px solid #f2a84c"
                frameDivBorder="1px solid var(--color-sandybrown)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="unset"
                dataBackground="linear-gradient(142.18deg, #3462cf, #2b53be)"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="01, Aug 2023"
                data1="Identifying specific pests or diseases present"
                soilPreparation="Pest Mngt."
                data2="Manual"
                man="/man2.svg"
                prop="2"
                women="/women2.svg"
                prop1="1"
                tractor1="/tractor-11.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="2"
                hours="14 Hours"
                hours1="0 Hours"
                eye11="/eye-1-13.svg"
                showMen
                showWomen
                showTrackor={false}
                showSpray={false}
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="1"
                frameDivBackgroundColor="1px solid #f2a84c"
                frameDivBorder="1px solid var(--color-sandybrown)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="#5e9765"
                dataBackground="unset"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="28, Jul 2023"
                data1="Incorporating fertilizers into the soil"
                soilPreparation="Fertilization"
                data2="Both"
                man="/man2.svg"
                prop="1"
                women="/women2.svg"
                prop1="1"
                tractor1="/tractor-1.svg"
                prop2="1"
                pesticide1="/pesticide-11.svg"
                prop3="1"
                hours="14 Hours"
                hours1="14 Hours"
                eye11="/eye-1-13.svg"
                showMen
                showWomen
                showTrackor
                showSpray
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="#a05148"
                frameDivBorder="1px solid var(--color-sienna)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="unset"
                dataBackground="linear-gradient(142.18deg, #3462cf, #2b53be)"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="27, Jul 2023"
                data1="Applying fertilizers evenly across fields"
                soilPreparation="Fertilization"
                data2="Both"
                man="/man2.svg"
                prop="1"
                women="/women3.svg"
                prop1="1"
                tractor1="/tractor-1.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="3"
                hours="12 Hours"
                hours1="10 Hours"
                eye11="/eye-1-14.svg"
                showMen
                showWomen
                showTrackor
                showSpray={false}
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="#a05148"
                frameDivBorder="1px solid var(--color-sienna)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="unset"
                dataBackground="linear-gradient(142.18deg, #3462cf, #2b53be)"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="26, Jul 2023"
                data1="Calculating and measuring fertilizer quantities"
                soilPreparation="Fertilization"
                data2="Both"
                man="/man2.svg"
                prop="1"
                women="/women3.svg"
                prop1="1"
                tractor1="/tractor-1.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="3"
                hours="21 Hours"
                hours1="14 Hours"
                eye11="/eye-1-14.svg"
                showMen
                showWomen={false}
                showTrackor
                showSpray
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="1"
                frameDivBackgroundColor="#a05148"
                frameDivBorder="1px solid var(--color-sienna)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="unset"
                dataBackground="linear-gradient(142.18deg, #3462cf, #2b53be)"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="24, Jul 2023"
                data1="Setting up irrigation equipment"
                soilPreparation="Irrigation"
                data2="Manual"
                man="/man3.svg"
                prop="2"
                women="/women4.svg"
                prop1="1"
                tractor1="/tractor-11.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="2"
                hours="21 Hours"
                hours1="0 Hours"
                eye11="/eye-1-15.svg"
                showMen
                showWomen
                showTrackor={false}
                showSpray={false}
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="1px solid #57b6f0"
                frameDivBorder="1px solid var(--color-deepskyblue)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="#5e9765"
                dataBackground="unset"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="24, Jul 2023"
                data1="Monitoring water pressure and flow"
                soilPreparation="Irrigation"
                data2="Manual"
                man="/man2.svg"
                prop="2"
                women="/women3.svg"
                prop1="1"
                tractor1="/tractor-11.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="2"
                hours="8 Hours"
                hours1="0 Hours"
                eye11="/eye-1-14.svg"
                showMen
                showWomen={false}
                showTrackor={false}
                showSpray={false}
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="1px solid #57b6f0"
                frameDivBorder="1px solid var(--color-deepskyblue)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="#5e9765"
                dataBackground="unset"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="20, Jul 2023"
                data1="Properly placing seeds or seedlings in the soil"
                soilPreparation="Planting"
                data2="Both"
                man="/man2.svg"
                prop="2"
                women="/women3.svg"
                prop1="4"
                tractor1="/tractor-1.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="0"
                hours="12 Hours"
                hours1="10 Hours"
                eye11="/eye-1-14.svg"
                showMen
                showWomen={false}
                showTrackor
                showSpray={false}
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="1"
                frameDivBackgroundColor="1px solid #05a155"
                frameDivBorder="1px solid var(--color-mediumseagreen-100)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="#d94841"
                dataBackground="unset"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="20, Jul 2023"
                data1="Seed selection or seedling procurement"
                soilPreparation="Planting"
                data2="Manual"
                man="/man2.svg"
                prop="2"
                women="/women2.svg"
                prop1="4"
                tractor1="/tractor-11.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="0"
                hours="40 Hours"
                hours1="0 Hours"
                eye11="/eye-1-13.svg"
                showMen
                showWomen
                showTrackor={false}
                showSpray={false}
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="1px solid #05a155"
                frameDivBorder="1px solid var(--color-mediumseagreen-100)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="#5e9765"
                dataBackground="unset"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="18, Jul 2023"
                data1="Soil leveling and smoothing"
                soilPreparation="Soil Preparation"
                data2="Both"
                man="/man2.svg"
                prop="2"
                women="/women2.svg"
                prop1="1"
                tractor1="/tractor-1.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="2"
                hours="14 Hours"
                hours1="12 Hours"
                eye11="/eye-1-13.svg"
                showMen
                showWomen={false}
                showTrackor
                showSpray={false}
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="1px solid #4a86f7"
                frameDivBorder="1px solid var(--primary-blue)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="unset"
                dataBackground="linear-gradient(142.18deg, #3462cf, #2b53be)"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
              <Row
                data="15, Jul 2023"
                data1="Adding organic matter or compost"
                soilPreparation="Soil Preparation"
                data2="Both"
                man="/man2.svg"
                prop="2"
                women="/women2.svg"
                prop1="1"
                tractor1="/tractor-1.svg"
                prop2="2"
                pesticide1="/pesticide-11.svg"
                prop3="2"
                hours="10 Hours"
                hours1="6 Hours"
                eye11="/eye-1-13.svg"
                showMen
                showWomen={false}
                showTrackor
                showSpray
                rowPosition="unset"
                rowBackgroundColor="#fff"
                rowJustifyContent="flex-start"
                rowAlignSelf="stretch"
                dataFlex="unset"
                frameDivBackgroundColor="1px solid #4a86f7"
                frameDivBorder="1px solid var(--primary-blue)"
                frameDivAlignItems="flex-start"
                soilPreparationColor="#fff"
                dataColor="unset"
                dataBackground="linear-gradient(142.18deg, #3462cf, #2b53be)"
                dataWebkitBackgroundClip="unset"
                dataWebkitTextFillColor="unset"
              />
            </div>
            <div className={styles.frameParent}>
              <div className={styles.frameDiv} />
              <div className={styles.vectorParent}>
                <img className={styles.vectorIcon1} alt="" src="/vector.svg" />
                <img className={styles.vectorIcon2} alt="" src="/vector1.svg" />
                <div className={styles.of276}>1-10 of 276</div>
                <div className={styles.rowsPerPage}>Rows per page: 10</div>
                <img
                  className={styles.polygonIcon}
                  alt=""
                  src="/polygon-3.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <SideBarMenu1 />
    </main>
  );
};

export default Dashboard;
