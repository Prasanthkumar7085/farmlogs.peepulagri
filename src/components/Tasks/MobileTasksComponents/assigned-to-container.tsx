import { Avatar, Button, CircularProgress, IconButton } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "src/components/Tasks/MobileTasksComponents/assigned-by-container.module.css";
import CheckIcon from '@mui/icons-material/Check';
import { Cancel, CancelOutlined, DeleteForever } from "@mui/icons-material";
import deleteAssigneeInTaskService from "../../../../lib/services/TasksService/deleteAssigneeInTaskService";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { removeUserDetails } from "@/Redux/Modules/Auth";
import { deleteAllMessages } from "@/Redux/Modules/Conversations";
const AssignedToContainer = ({
  setUsersDrawerOpen,
  assignee,
  hasEditAccess,
  data,
  status,
  getTaskById
}: any) => {
  
  const router = useRouter();
  const dispatch = useDispatch();
  const loggedInUserId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [checkBoxOpen, setCheckBoxOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [, , removeCookie] = useCookies(["userType_v2"]);
  const [, , loggedIn_v2] = useCookies(["loggedIn_v2"]);

  const handleClickAfterLongPress = (id: string) => {
   
    if (selectedUserIds.includes(id)) {
      let array = [...selectedUserIds];
      array.splice(selectedUserIds.indexOf(id), 1);
      setSelectedUserIds(array);
      if (!array.length) {
        setCheckBoxOpen(false);
    }
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  }

  const logout = async () => {
    try {
      removeCookie("userType_v2");
      loggedIn_v2("loggedIn_v2");
      router.push("/");
      await dispatch(removeUserDetails());
      await dispatch(deleteAllMessages());
    } catch (err: any) {
      console.error(err);
    }
  };

  const deleteAssignee = async () => {
    setDeleteLoading(true)
    try {
      let body = {
        assign_to: selectedUserIds,
      };
        const response = await deleteAssigneeInTaskService({id:router.query.task_id as string,token:accessToken,body:body})
      if (response?.success) {
        toast.success(response?.message);
        setCheckBoxOpen(false);
        getTaskById();  
      } else if (response?.status == 422) {
        toast.error(response?.message);
      } else if (response?.status == 401) {
        logout();
      }
    }
    catch (err) {
      console.error(err);
      
    } finally {
      setDeleteLoading(false)
    }
  }


  return (
    <div className={styles.assignedTocontainer}>
      <div className={styles.assignToHeader}>
        <p className={styles.assignedToHeading}>Assigned To</p>
        {/* {checkBoxOpen && loggedInUserId == data?.created_by?._id&&selectedUserIds?.length ?
          <div style={{display:"flex"}}>
            <IconButton onClick={() => {
            setCheckBoxOpen(false)
            setSelectedUserIds([])
          }}>
            <CancelOutlined sx={{fontSize:"1.2rem"}} />
            </IconButton>
            
            {deleteLoading ?
              <CircularProgress size="1.2rem" sx={{ color: "black" }} />
              : <IconButton onClick={() => deleteAssignee()}>
                <DeleteForever/>
              </IconButton>}
            
          </div>
          : ""} */}
        {loggedInUserId == data?.created_by?._id || hasEditAccess ? (
          checkBoxOpen && loggedInUserId == data?.created_by?._id && selectedUserIds?.length ?
          <div style={{display:"flex"}}>
          <IconButton onClick={() => {
          setCheckBoxOpen(false)
          setSelectedUserIds([])
        }}>
          <CancelOutlined sx={{fontSize:"1.2rem"}} />
          </IconButton>
          
          {deleteLoading ?
            <CircularProgress size="1.2rem" sx={{ color: "black" }} />
            : <IconButton onClick={() => deleteAssignee()}>
              <DeleteForever/>
            </IconButton>}
          
        </div> : <Button
            className={styles.addAssigneeBtn}
            disabled={
              status === "DONE"
            }
            onClick={() => setUsersDrawerOpen(true)}
          >
            <Image
              src="/viewTaskIcons/plus-icon-green.svg"
              alt=""
              width={12}
              height={12}
            />
            Add
          </Button>
         
        ) : (
          ""
        )}
      </div>
      <div className={styles.allAssignysList}>
        {assignee
          ? assignee.map(
            (item: { _id: string; name: string }, index: number) => {
              return (
                <div className={styles.noselect} id={styles.persondetails} key={index}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (loggedInUserId == data?.created_by?._id) {
                        setCheckBoxOpen(true);
                        handleClickAfterLongPress(item._id);
                    }
                }} // Prevent right-click context menu
                onTouchStart={(e) => {
                  if (e.touches.length > 1) {
                    e.preventDefault(); // Prevent multi-touch event
                  }
                  }}
                  onClick={() => {
                    if (loggedInUserId == data?.created_by?._id && checkBoxOpen) {
                      handleClickAfterLongPress(item._id); 
                    }
                  }}>
                  {checkBoxOpen && selectedUserIds.includes(item._id) ?
                 <Avatar
                 sx={{
                   fontSize: "9px",
                   width: "20px",
                   height: "20px",
                   background: "green",
                 }}
               >
                      <CheckIcon sx={{fontSize:"1rem"}} />
               </Avatar> : <Avatar
                    sx={{
                      fontSize: "9px",
                      width: "20px",
                      height: "20px",
                      background: "red",
                    }}
                  >
                    {item.name.split(" ")?.length > 1
                      ? `${item.name.split(" ")[0][0]}${item.name.split(" ")[1][0]
                        }`.toUpperCase()
                      : item.name.slice(0, 2)?.toUpperCase()}
                  </Avatar>}
                  <p className={styles.assigneeName}>{item?.name}</p>
                </div>
              );
            }
          )
          : "-"}
      </div>
    </div>
  );
};

export default AssignedToContainer;
