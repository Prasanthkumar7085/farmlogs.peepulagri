import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import deleteProcurmentByIdService from "../../../../lib/services/ProcurementServices/deleteProcurmentByIdService";
import ImageComponent from "@/components/Core/ImageComponent";
import timePipe from "@/pipes/timePipe";
import Link from "next/link";
import TanStackTableProcurmentComponent from "./ProcurementsTanStackTable";
import { ApiCallProps } from "./ListProcurements";
import { TaskResponseTypes } from "@/types/tasksTypes";
import AlertDelete from "@/components/Core/DeleteAlert/alert-delete";
import { Avatar, Tooltip } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { setAllFarms } from "@/Redux/Modules/Farms";


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
//   }: any)
// }
const ProcurementsTableComponent = ({
  data,
  getData,
  paginationDetails,
}: any) => {
  const router = useRouter();

  const userType_v2 = useSelector(
    (state: any) => state.auth.userDetails?.user_details?.user_type
  );
  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteProcurments, setdeleteProcurments] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<any>(false);
  const [rowDetails, setRowDetails] = useState<any>();
  const [attachmentdrawer, setAttachmentDrawer] = useState<any>(false);
  const [openLogs, setOpenLogs] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [showAllAssignee, setShowAllAssignee] = useState(false);
  const [showAllFarms, setShowAllFarms] = useState(false);

  const [viewMoreId, setViewMoreId] = useState("");


  const deleteProcurment = async () => {
    setDeleteLoading(true);

    const response = await deleteProcurmentByIdService({
      procurmentId: deleteProcurments,
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

  //material required component
  const MaterialAssignedComponent = ({ info }: any) => {
    let value = info.getValue()?.materials_required;
    let id = info.getValue()?._id;
    value =
      value?.length > 2
        ? showAllAssignee && id == viewMoreId
          ? value
          : value.slice(0, 2)
        : value;
    return (
      <div style={{
        display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"
      }}>
        <div
          style={{
            color: value?.length ? "" : "#9a9a9a",
          }
          }
        >
          {
            value?.length
              ? value
                .map((item: { _id: string; name: string }) => item.name)
                .join(", ")
              : "*No Materials*"}

          {
            info.getValue()?.materials_required?.length > 2 ? (
              <div
                style={{ color: "#9a9a9a" }}
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

                {showAllAssignee && id == viewMoreId ? <Avatar sx={{ bgcolor: deepOrange[500], width: 24, height: 24, fontSize: "10px" }}>-</Avatar>
                  : <Avatar sx={{ bgcolor: deepOrange[500], width: 24, height: 24, fontSize: "10px" }}>+{info.getValue()?.materials_required?.length - 2}</Avatar>}          </div>
            ) : (
              ""
            )
          }
        </div >
      </div >
    );
  };

  //farm titles component
  const FarmTitleComponent = ({ info }: any) => {
    let value = info.getValue()?.farm_ids;
    let id = info.getValue()?._id;
    value =
      value?.length > 2
        ? showAllFarms && id == viewMoreId
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
            .map((item: { _id: string; title: string }) => item.title)
            .join(", ")
          : "*No Farms*"}
        {info.getValue()?.farm_ids?.length > 2 ? (
          <div
            style={{ color: "#9a9a9a" }}
            onClick={() => {
              if (viewMoreId) {
                if (id == viewMoreId) {
                  setShowAllFarms((prev) => !prev);
                  setViewMoreId("");
                } else {
                  setViewMoreId(id);
                }
              } else {
                setViewMoreId(id);
                setShowAllFarms((prev) => !prev);
              }
            }}
          >
            {showAllFarms && id == viewMoreId ? <Avatar sx={{ bgcolor: deepOrange[500], width: 24, height: 24, fontSize: "10px" }}>-</Avatar>
              : <Avatar sx={{ bgcolor: deepOrange[500], width: 24, height: 24, fontSize: "10px" }}>+{info.getValue()?.farm_ids?.length - 2}</Avatar>}
          </div>
        ) : (
          ""
        )}
      </span>
    );
  }

  const columns = [
    {
      accessorFn: (row: any) => row.serial,
      id: "id",
      header: () => <span>S.No</span>,
      footer: (props: any) => props.column.id,
      width: "50px",
      minWidth: "50px",
      maxWidth: "50px",
    },

    {
      accessorFn: (row: any) => row.title,
      id: "title",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue()}
        </span>
      ),
      header: () => <span>Operation Name</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
    },
    {
      accessorFn: (row: any) => row?.date_of_operation,
      id: "date_of_operation",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {timePipe(info.getValue(), "DD-MM-YYYY")}
        </span>
      ),
      header: () => <span>Date of Operation</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => {
        return { farm_ids: row.farm_ids, _id: row._id };
      },
      id: "farm_ids",
      cell: (info: any) => <FarmTitleComponent info={info} />,
      header: () => <span>Farm Name</span>,
      footer: (props: any) => props.column.id,
      width: "350px",
    },
    {
      accessorFn: (row: any) => row.point_of_contact?.name,
      id: "point_of_contact.name",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue()}
        </span>
      ),
      header: () => <span>POC</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },

    {
      accessorFn: (row: any) => row.approved_by?.name,
      id: "approved_by.name",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue()}
        </span>
      ),
      header: () => <span>Approved By</span>,
      footer: (props: any) => props.column.id,
      width: "200px",
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
      accessorFn: (row: any) => row.priority,
      id: "priority",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue()}
        </span>
      ),
      header: () => <span>Priority</span>,
      footer: (props: any) => props.column.id,
      width: "120px",
    },
    // {
    //   accessorFn: (row: any) => row.completed_at,
    //   id: "completed_at",
    //   cell: (info: any) => (
    //     <span style={{ padding: "40px 10px 40px 10px" }}>
    //       {timePipe(info.getValue(), "DD-MM-YYYY")}
    //     </span>
    //   ),
    //   header: () => <span>Day of Closing</span>,
    //   footer: (props: any) => props.column.id,
    //   width: "120px",
    // },
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
              }}
            >
              <Tooltip followCursor arrow title="View">
                <Link href={`/procurements/${info.row.original?._id}`}>
                  <ImageComponent
                    src="/view-icon.svg"
                    height={17}
                    width={17}
                    alt=""
                  />
                </Link>
              </Tooltip>
              <Tooltip followCursor arrow title="Edit">
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    router.push(`/procurements/${info.row.original?._id}/edit`)
                  }
                >
                  <ImageComponent
                    src="/pencil-icon.svg"
                    height={17}
                    width={17}
                    alt=""
                  />
                </div>
              </Tooltip>

              {userType_v2 !== "farmer" ? (
                <Tooltip followCursor arrow title="Delete">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setdeleteProcurments(info.row.original?._id);
                      setDialogOpen(true);
                    }}
                  >
                    <ImageComponent
                      src="/trast-icon.svg"
                      height={17}
                      width={17}
                      alt=""
                    />
                  </div>
                </Tooltip>
              ) : (
                ""
              )}
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
      <TanStackTableProcurmentComponent
        data={data}
        columns={columns}
        paginationDetails={paginationDetails}
        getData={getData}
      />

      <AlertDelete
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
        deleteFarm={deleteProcurment}
        loading={deleteLoading}
        deleteTitleProp={"Procurement"}
      />

      {/* <DrawerBoxComponent
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
      <ViewLogs openLogs={openLogs} setOpenLogs={setOpenLogs} taskId={taskId} />  */}

      <Toaster richColors position="top-right" closeButton />
    </div>
  );
};

export default ProcurementsTableComponent;

