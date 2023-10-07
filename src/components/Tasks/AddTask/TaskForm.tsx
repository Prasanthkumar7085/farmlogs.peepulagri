import { FunctionComponent, useState, useCallback, useEffect } from "react";
import {
  Button,
  Icon,
  TextField
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import styles from "./TaskForm.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import getAllFarmsService from "../../../../lib/services/FarmsService/getAllFarmsService";
import FarmAutoCompleteInAddTask from "./FarmAutoCompleteInAddTask";
import FooterActionButtons from "./footer-action-buttons";
import addTaskService from "../../../../lib/services/TasksService/addTaskService";
import AlertComponent from "@/components/Core/AlertComponent";
import ErrorMessages from "@/components/Core/ErrorMessages";
import LoadingComponent from "@/components/Core/LoadingComponent";


const TaskForm = ({data}:any) => {

  console.log(data);

  
  const router = useRouter();
  
  const accessToken = useSelector((state: any) => state.auth.userDetails?.access_token);
  
  const [farmData, setFarmData] = useState([]);
  const [defaultValue, setDefaultValue] = useState<any>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<any>(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(false);
  
  const getAllFarms = async () => {
    const response = await getAllFarmsService(accessToken);
    if (response?.success) {
      setFarmData(response?.data);
    }
  }
  
  
  const captureFarmName = (selectedObject: any) => {
    if (selectedObject && Object.keys(selectedObject).length) {
      setDefaultValue(selectedObject?._id);
    }
  }
  
  
  const addTask = async () => {
    setErrorMessages({});
    setLoading(true);
    let body = {
      farm_id: defaultValue,
      categories: [],
      deadline: deadline?.toISOString(),
      description:description,
      title: title,
    }
    
    let response = await addTaskService({body:body, token:accessToken});
    if (response?.success) {
      setAlertMessage(response?.message);
      setAlertType(true);
    } else if(response?.status==422){
      setErrorMessages(response?.errors);
    }
    setLoading(false);
    
  }
  
  useEffect(() => {
    getAllFarms()    
  }, [router.isReady, accessToken]);
  
  
  const setDataInEdit = () => {
    setTitle(data?.title);
    setDescription(data?.description);
    setDefaultValue(data?.farm_id);
    // setDeadline(data?.deadline);
  };

  useEffect(() => {
    setDataInEdit();
  }, [data]);
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        <div className={styles.form}>
          <div className={styles.header}>
            <Button
              onClick={()=>router.back()}
              className={styles.backbutton}
              sx={{ width: 40 }}
              color="primary"
              name="Back"
              variant="contained"
              startIcon={<Icon>arrow_back_sharp</Icon>}
            />
            <div className={styles.textwrapper}>
              <p className={styles.smalltext}>{`Back to List `}</p>
              <h1 className={styles.largetext}>Add Task</h1>
            </div>
          </div>
          <div className={styles.container}>
            <form className={styles.formfields}>
              <div className={styles.selectfarm}>
                <label className={styles.lable}>{`Select Farm`}<span style={{color:"red"}}>*</span></label>
                <FarmAutoCompleteInAddTask
                options={farmData}
                label={"title"}
                onSelectValueFromDropDown={captureFarmName}
                placeholder={"Select Farm"}
                defaultValue={defaultValue}
                />
                <ErrorMessages errorMessages={errorMessages} keyname='farm_id' />
              </div>
              <div className={styles.selectfarm}>
                <h4 className={styles.title}>Title<span style={{color:"red"}}>*</span></h4>
                <TextField
                  className={styles.inoutbox}
                  color="primary"
                  placeholder="Enter your Task title here"
                  required={true}
                  fullWidth={true}
                  variant="outlined"
                  value={title}
                  onChange={(e)=>setTitle(e.target.value)}
                />
                <ErrorMessages errorMessages={errorMessages} keyname='title' />
              </div>
              <div className={styles.selectfarm}>
                <label className={styles.lable}>Deadline<span style={{color:"red"}}>*</span></label>
                <div className={styles.backbutton}>
                  <DatePicker
                    value={deadline}
                    onChange={(newValue: any) => {
                      setDeadline(newValue);
                    }}
                    slotProps={{
                      textField: {
                        variant: "standard",
                        size: "medium",
                        color: "primary",
                      },
                    }}
                  />
                  <ErrorMessages errorMessages={errorMessages} keyname='deadline' />
                </div>
              </div>
              <div className={styles.selectfarm}>
                <label className={styles.lable}>Description</label>
                <TextField
                  className={styles.inoutbox}
                  color="primary"
                  placeholder="Enter your Task title here"
                  fullWidth={true}
                  variant="outlined"
                  value={description}
                  onChange={(e)=>setDescription(e.target.value)}
                />
                
              </div>
            </form>
          </div>
        </div>
        <FooterActionButtons addTask={addTask} />
      </>
      <AlertComponent alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
      <LoadingComponent loading={loading}/>
    </LocalizationProvider>
  );
};

export default TaskForm;
