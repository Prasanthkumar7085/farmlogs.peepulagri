import type { NextPage } from "next";
import { Button, Icon, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import styles from "src/components/Tasks/MobileTasksComponents/componentsHeader.module.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import deleteTaskByIdService from "../../../../lib/services/TasksService/deleteTaskByIdService";
import { Toaster, toast } from "sonner";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";

const ViewtaskHeader = ({ data, status }: any) => {
  const router = useRouter();

  const userId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );
  const loggedInUserId = useSelector(
    (state: any) => state.auth.userDetails?.user_details?._id
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);


  const deleteTask = async () => {
    setDeleteLoading(true);

    const response = await deleteTaskByIdService({
      taskId: router.query.task_id as string,
      token: accessToken,
    });
    if (response?.success) {
      setDialogOpen(false);
      setTimeout(() => {
        router.push('/users-tasks');

      }, 1000)
      toast.success(response?.message);

    } else {
      toast.error(response?.message);
    }
    setDeleteLoading(false);
  };


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <header className={styles.header}>
      <div className={styles.actions}>
        <IconButton sx={{ padding: "0" }}

          onClick={() => router.back()}
        ><img alt=""
          src="/arrowdownbold-1@2x.png" width="24px" /> </IconButton>
        <p className={styles.headerTitle}>View Task</p>
        {loggedInUserId == data?.created_by?._id ? (
          <IconButton sx={{ padding: "0" }}
            onClick={handleClick}
          ><MoreVertIcon sx={{ color: "#fff" }} /></IconButton>
        ) : (
          <IconButton sx={{ padding: "0", opacity: 0, cursor: "default" }}

          ><MoreVertIcon sx={{ color: "#fff" }} /></IconButton>
        )}
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem disabled={status === "DONE"} onClick={() => setDialogOpen(true)}>Delete</MenuItem>
        </Menu>
        <AlertDelete
          open={dialogOpen}
          setDialogOpen={setDialogOpen}
          deleteFarm={deleteTask}
          loading={deleteLoading}
          deleteTitleProp={"Task"}
        />
        <Toaster richColors position="top-right" closeButton />
      </div>


    </header>
  );
};

export default ViewtaskHeader;
