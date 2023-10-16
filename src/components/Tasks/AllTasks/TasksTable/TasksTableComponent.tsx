import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import { TaskResponseTypes } from "@/types/tasksTypes";
import { Button, ClickAwayListener, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import TanStackTableComponent from "./TanStackTable";
import { Toaster, toast } from "sonner";
import deleteTaskByIdService from "../../../../../lib/services/TasksService/deleteTaskByIdService";
import { useSelector } from "react-redux";
import { ApiCallProps } from "../TasksPageComponent";
import DrawerBoxComponent from "../../TaskComments/DrawerBox";
import ImageComponent from "@/components/Core/ImageComponent";

interface pageProps {
  data: Array<TaskResponseTypes> | any;
  getData: ({
    page = 1,
    limit = 10,
    search_string = "",
    sortBy = "",
    sortType = "",
    selectedFarmId = "",
    status = "",
  }: ApiCallProps) => void;
  paginationDetails: any;
}
const TasksTableComponent = ({
  data,
  getData,
  paginationDetails,
}: pageProps) => {
  const router = useRouter();

  const userType = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<any>(false);
  const [rowDetails, setRowDetails] = useState<any>();

  const deleteTask = async () => {
    setDeleteLoading(true);

    const response = await deleteTaskByIdService({
      taskId: deleteTaskId,
      token: accessToken,
    });
    if (response?.success) {
      setDialogOpen(false);
      toast.success(response?.message);
      await getData({
        page: router.query.page as string,
        limit: router.query.limit as string,
        search_string: router.query.search_string as string,
        sortBy: router.query.order_by as string,
        sortType: router.query.order_type as string,
        selectedFarmId: router.query.farm_id as string,
        status: router.query.status as string,
      });
    } else {
      toast.error(response?.message);
    }
    setDeleteLoading(false);
  };

  const columns = [
    {
      accessorFn: (row: any) => row.createdAt,
      id: "createdAt",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue().slice(0, 10)}
        </span>
      ),
      header: () => <span>Created On</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
    },
    {
      accessorFn: (row: any) => row.farm_id.title,
      id: "farm_id.title",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue()}
        </span>
      ),
      header: () => <span>Farm Name</span>,
      footer: (props: any) => props.column.id,
      width: "200px",
    },
    {
      accessorFn: (row: any) => row.assigned_to?.phone,
      id: "assigned_to",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue()}
        </span>
      ),
      header: () => <span>Assigned to</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },

    {
      accessorFn: (row: any) => row.title,
      id: "title",
      cell: (info: any) => (
        <span
          style={{ wordWrap: "break-word", padding: "40px 10px 40px 10px" }}
        >
          {info.getValue()}
        </span>
      ),
      header: () => <span style={{ maxWidth: "400px" }}>Title</span>,
      footer: (props: any) => props.column.id,
      width: "250px",
    },
    {
      accessorFn: (row: any) => row.description,
      id: "description",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          <Tooltip
            title={
              info.getValue()?.length > 50 ? (
                <div style={{ fontSize: "15px" }}>{info.getValue()}</div>
              ) : (
                ""
              )
            }
          >
            <span>
              {info.getValue()
                ? info.getValue()?.length > 50
                  ? info.getValue().slice(0, 46) + "....."
                  : info.getValue()
                : "-"}
            </span>
          </Tooltip>
        </span>
      ),
      header: () => <span>Description</span>,
      footer: (props: any) => props.column.id,
      width: "350px",
    },
    {
      accessorFn: (row: any) => row.deadline,
      id: "deadline",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue()?.slice(0, 10)}
        </span>
      ),
      header: () => <span>Due Date</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
    },
    {
      accessorFn: (row: any) => row.status,
      id: "status",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue()}
        </span>
      ),
      header: () => <span>Status</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
    },
    {
      // accessorFn: (row: any) => row.description,
      id: "actions",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {/* "/view-icon.svg" "/pencil-icon.svg" "/trast-icon.svg" */}
          {
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/tasks/${info.row.original?._id}`)}
              >
                <ImageComponent
                  src="/view-icon.svg"
                  height={17}
                  width={17}
                  alt="view"
                />
              </div>
              {/* <div
                style={{ cursor: "pointer" }}
                onClick={() =>
                  router.push(`/tasks/${info.row.original?._id}/edit`)
                }
              >
                <ImageComponent
                  src="/pencil-icon.svg"
                  height={17}
                  width={17}
                  alt="view"
                />
              </div> */}
              {userType !== "USER" ? (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setDeleteTaskId(info.row.original?._id);
                    setDialogOpen(true);
                  }}
                >
                  <ImageComponent
                    src="/trast-icon.svg"
                    height={17}
                    width={17}
                    alt="view"
                  />
                </div>
              ) : (
                ""
              )}
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setRowDetails(info.row.original);
                  setDrawerOpen(true);
                }}
              >
                <ImageComponent
                  src="/task-comments.svg"
                  height={17}
                  width={17}
                  alt="comments"
                />
              </div>
            </div>
          }
        </span>
      ),
      header: () => <span>Actions</span>,
      footer: (props: any) => props.column.id,
      width: "100px",
    },
  ];

  const drawerClose = () => {
    setDrawerOpen(false);
  };
  return (
    <div>
      <TanStackTableComponent
        data={data}
        columns={columns}
        paginationDetails={paginationDetails}
        getData={getData}
      />

      <AlertDelete
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
        deleteFarm={deleteTask}
        loading={deleteLoading}
      />
      {drawerOpen ? (
        <DrawerBoxComponent
          drawerClose={drawerClose}
          rowDetails={rowDetails}
          setDrawerOpen={setDrawerOpen}
          drawerOpen={drawerOpen}
        />
      ) : (
        // </ClickAwayListener>
        ""
      )}
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};

export default TasksTableComponent;
