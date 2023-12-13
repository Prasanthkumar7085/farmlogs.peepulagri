import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import { TaskResponseTypes } from "@/types/tasksTypes";
import { Button, Chip, ClickAwayListener, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import TanStackTableComponent from "./TanStackTable";
import { Toaster, toast } from "sonner";
import deleteTaskByIdService from "../../../../../lib/services/TasksService/deleteTaskByIdService";
import { useSelector } from "react-redux";
import { ApiCallProps } from "../TasksPageComponent";
import DrawerBoxComponent from "../../TaskComments/DrawerBox";
import ImageComponent from "@/components/Core/ImageComponent";
import timePipe from "@/pipes/timePipe";
import AttachmentDrawerTaskmodule from "./AttachmentDrawer";
import Link from "next/link";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ViewLogs from "../../ViewTask/ViewLogs";

// interface pageProps {
//   data: Array<TaskResponseTypes> | any;
//   getData: ({
//     page = 1,
//     limit = 10,
//     search_string = "",
//     sortBy = "",
//     sortType = "",
//     selectedFarmId = "",
//     status = "",
//   }: ApiCallProps) => void;
//   paginationDetails: any;
// }
const TasksTableComponent = ({
  data,
  getData,
  paginationDetails,
}: any) => {
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
  const [attachmentdrawer, setAttachmentDrawer] = useState<any>(false);
  const [openLogs, setOpenLogs] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [showAllAssignee, setShowAllAssignee] = useState(false);
  const [viewMoreId, setViewMoreId] = useState("");

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
        sortBy: router.query.sort_by as string,
        sortType: router.query.sort_type as string,
        selectedFarmId: router.query.farm_id as string,
        status: router.query.status as string,
        userId: router.query.assigned_to as string,
      });
    } else {
      toast.error(response?.message);
    }
    setDeleteLoading(false);
  };

  //task-overdue-icon.svg
  const getStatusLabel = (label: string) => {
    if (!label) return "";

    return (
      <div style={{ display: "flex", gap: "5px" }}>
        <ImageComponent
          src={`/task-${label}.svg`}
          height={10}
          width={10}
          alt="task-status"
        />
        <span>{label}</span>
      </div>
    );
  };

  const AssignedComponent = ({ info }: any) => {
    let value = info.getValue()?.assign_to;
    let id = info.getValue()?._id;
    value =
      value?.length > 2
        ? showAllAssignee && id == viewMoreId
          ? value
          : value.slice(0, 2)
        : value;
    return (
      <span
        style={{
          padding: "40px 10px 40px 10px",
          color: value?.length ? "" : "#9a9a9a",
        }}
      >
        {value?.length
          ? value
            .map((item: { _id: string; name: string }) => item.name)
            .join(", ")
          : "*Not Assigned*"}
        {info.getValue()?.assign_to?.length > 2 ? (
          <div
            style={{ color: "#9a9a9a", cursor: "pointer" }}
            onClick={() => {
              if (viewMoreId) {
                if (id == viewMoreId) {
                  setShowAllAssignee((prev) => !prev);
                  setViewMoreId("");
                } else {
                  setViewMoreId(id);
                }
              } else {
                setViewMoreId(id);
                setShowAllAssignee((prev) => !prev);
              }
            }}
          >
            {showAllAssignee && id == viewMoreId ? "Show Less" : "Show More"}
          </div>
        ) : (
          ""
        )}
      </span>
    );
  };
  const columns = [
    {
      accessorFn: (row: any) => row.createdAt,
      id: "createdAt",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {timePipe(info.getValue(), "DD-MM-YYYY")}
        </span>
      ),
      header: () => <span>Created On</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
    },
    // {
    //   accessorFn: (row: any) => row?.farm_ids,
    //   id: "farm_id.title",
    //   cell: (info: any) => (
    //     <span style={{ padding: "40px 10px 40px 10px" }}>
    //       {info.getValue()}
    //     </span>
    //   ),
    //   header: () => <span>Farm Name</span>,
    //   footer: (props: any) => props.column.id,
    //   width: "200px",
    // },
    {
      accessorFn: (row: any) => {
        return { assign_to: row.assign_to, _id: row._id };
      },
      id: "assigned_to",
      cell: (info: any) => <AssignedComponent info={info} />,
      header: () => <span>Assigned to</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },

    {
      accessorFn: (row: any) => row.title,
      id: "title",
      cell: (info: any) => (
        <Tooltip
          title={
            info.getValue()?.length > 34 ? (
              <div style={{ fontSize: "15px" }}>{info.getValue()}</div>
            ) : (
              ""
            )
          }
        >
          <span>
            {info.getValue()
              ? info.getValue()?.length > 34
                ? (info.getValue()
                  ? info.getValue().slice(0, 1).toUpperCase() +
                  info.getValue().slice(1, 30)
                  : "") + "....."
                : info.getValue()
                  ? info.getValue().slice(0, 1).toUpperCase() +
                  info.getValue().slice(1)
                  : ""
              : ""}
          </span>
        </Tooltip>
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
              info.getValue()?.length > 45 ? (
                <div style={{ fontSize: "15px" }}>{info.getValue()}</div>
              ) : (
                ""
              )
            }
          >
            <span>
              {info.getValue()
                ? info.getValue()?.length > 45
                  ? (info.getValue()
                    ? info.getValue().slice(0, 1).toUpperCase() +
                    info.getValue().slice(1, 41)
                    : "") + "....."
                  : info.getValue()
                    ? info.getValue().slice(0, 1).toUpperCase() +
                    info.getValue().slice(1)
                    : "-"
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
          {timePipe(info.getValue(), "DD-MM-YYYY")}
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
          {getStatusLabel(info.getValue())}
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
          {
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
                alignItems: "center !important"
              }}
            >
              <Link href={`/tasks/${info.row.original?._id}`}>
                <ImageComponent
                  src="/view-icon.svg"
                  height={17}
                  width={17}
                  alt="view"
                />
              </Link>
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
              {userType !== "farmer" ? (
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
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setRowDetails(info.row.original);
                  setAttachmentDrawer(true);
                }}
              >
                <ImageComponent
                  src="/task-table-attachment-icon.svg"
                  height={17}
                  width={17}
                  alt=""
                />
              </div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpenLogs((prev) => !prev);
                  setTaskId(info.row.original?._id);
                }}
              >
                <SummarizeIcon sx={{ color: "#4986f7", fontSize: "1.3rem" }} />
              </div>
            </div>
          }
        </span>
      ),
      header: () => <span>Actions</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
  ];

  const drawerClose = () => {
    setDrawerOpen(false);
  };
  const attachmentDrawerClose = () => {
    setAttachmentDrawer(false);
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
        deleteTitleProp={"Task"}
      />

      <DrawerBoxComponent
        drawerClose={drawerClose}
        rowDetails={rowDetails}
        setDrawerOpen={setDrawerOpen}
        drawerOpen={drawerOpen}
      />

      <AttachmentDrawerTaskmodule
        attachmentDrawerClose={attachmentDrawerClose}
        rowDetails={rowDetails}
        setAttachmentDrawer={setAttachmentDrawer}
        attachmentdrawer={attachmentdrawer}
      />
      <ViewLogs openLogs={openLogs} setOpenLogs={setOpenLogs} taskId={taskId} />

      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};

export default TasksTableComponent;

