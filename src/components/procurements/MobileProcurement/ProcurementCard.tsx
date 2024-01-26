import LoadingComponent from "@/components/Core/LoadingComponent";
import { Avatar, AvatarGroup } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";

const ProcurementCard = ({ data, lastBookElementRef, hasMore, lastItemRef, loading }: any) => {
    const router = useRouter();

    return (
        <div >
            <div>
                hello
            </div>
            {data?.length ? (
                data?.map((item: any, index: any) => {
                    if (data.length === index + 1 && hasMore == true) {
                        return (
                            <div


                                onClick={() => router.push(`/users-tasks/${item._id}/view`)}
                                key={index}
                                ref={lastBookElementRef}
                            >
                                <div >
                                    <div >
                                        <h2 >
                                            {item?.title
                                                ? item?.title?.length > 25
                                                    ? item?.title?.slice(0, 1).toUpperCase() +
                                                    item?.title?.slice(1, 22) +
                                                    "..."
                                                    : item?.title[0].toUpperCase() + item?.title?.slice(1)
                                                : "ty"}
                                        </h2>
                                        <div >
                                            <Image
                                                width={25}
                                                height={25}
                                                alt=""
                                                src="/calendarblank-1@2x.png"
                                            />
                                            <p >
                                                {moment(item.deadline).format("DD-MM-YYYY")}
                                            </p>
                                        </div>
                                    </div>
                                    <div >
                                        <AvatarGroup sx={{
                                            '& .MuiAvatar-root': {
                                                fontSize: "10px !important",
                                                width: "22px !important",
                                                height: "22px !important",
                                                background: "#d94841 !important",
                                            }
                                        }} total={item?.assign_to?.length} max={3}>
                                            {item?.assign_to?.map((assignee: any, assigneeindex: any) => {
                                                return (
                                                    <Avatar sx={{
                                                        fontSize: "10px",
                                                        width: "22px",
                                                        height: "22px",
                                                        background: "#d94841",

                                                    }} key={assigneeindex} >
                                                        {assignee?.name?.split(" ")?.length > 3
                                                            ? `${assignee?.name?.split(" ")[0][0]}${assignee?.name?.split(" ")[1][0]}`.toUpperCase()
                                                            : assignee?.name.slice(0, 2)?.toUpperCase()}
                                                    </Avatar>
                                                );
                                            })}
                                        </AvatarGroup>

                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div

                                onClick={() => router.push(`/users-tasks/${item._id}/view`)}
                                key={index}
                                ref={index === data.length - 15 ? lastItemRef : null}
                            >
                                <div >
                                    <div >
                                        <h2 >
                                            {item?.title
                                                ? item?.title?.length > 25
                                                    ? item?.title?.slice(0, 1).toUpperCase() +
                                                    item?.title?.slice(1, 22) +
                                                    "..."
                                                    : item?.title[0].toUpperCase() +
                                                    item?.title?.slice(1)
                                                : "ty"}
                                        </h2>
                                        <div >
                                            <Image
                                                width={15}
                                                height={15}
                                                alt=""
                                                src="/calendarblank-1@2x.png"
                                            />
                                            <p >
                                                {moment(item.deadline).format("DD-MM-YYYY")}
                                            </p>
                                        </div>
                                    </div>
                                    <div >


                                        <AvatarGroup sx={{
                                            '& .MuiAvatar-root': {
                                                fontSize: "10px !important",
                                                width: "22px !important",
                                                height: "22px !important",
                                                background: "#d94841 !important",
                                            }
                                        }} total={item?.assign_to?.length} max={5}>
                                            {item?.assign_to?.map((assignee: any, assigneeindex: any) => {
                                                return (
                                                    <Avatar sx={{
                                                        fontSize: "10px",
                                                        width: "22px",
                                                        height: "22px",
                                                        background: "#d94841",
                                                    }} key={assigneeindex} >
                                                        {assignee?.name?.split(" ")?.length > 3
                                                            ? `${assignee?.name?.split(" ")[0][0]}${assignee?.name?.split(" ")[1][0]}`.toUpperCase()
                                                            : assignee?.name.slice(0, 2)?.toUpperCase()}
                                                    </Avatar>
                                                );
                                            })}
                                        </AvatarGroup>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })
            )
                : !loading ? (
                    <div style={{ display: "flex", alignItems: "center", flexDirection: "column", height: "calc(100vh - 250px)", justifyContent: "center" }}>
                        <img src="/viewTaskIcons/No-Data-Tasks.svg" alt="" />
                        <p style={{ margin: "0", fontFamily: "'Inter', sans-serif", color: "#000", fontSize: "clamp(14px, 3vw, 16px" }}>
                            No Tasks
                        </p>
                    </div>) : (
                    ""
                )}
            <LoadingComponent loading={loading} />

        </div>
    );
}

export default ProcurementCard;