import { Button, Chip } from "@mui/material";
import { useRouter } from "next/router";
import styles from "../../Tasks/MobileTasksComponents/tabs.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { prepareURLEncodedParamsWithArray } from "../../../../lib/requestUtils/urlEncoderWithArray";

const ProcurementTabs = ({ onStatusChange }: { onStatusChange: (value: any) => void }) => {
    const router = useRouter();

    const accessToken = useSelector(
        (state: any) => state.auth.userDetails?.access_token
    );

    const [counts, setCounts] = useState<any>({});

    const getAllStatsCount = async () => {
        try {
            let urls = [
                "/procurement-requests/stats/count/procurement-requests?",
                "/procurement-requests/stats/count/procurement-requests?status=PENDING",
                "/procurement-requests/stats/count/procurement-requests?status=APPROVED",
                "/procurement-requests/stats/count/procurement-requests?status=PURCHASED",
                "/procurement-requests/stats/count/procurement-requests?status=SHIPPED",
                "/procurement-requests/stats/count/procurement-requests?status=DELIVERED",
                "/procurement-requests/stats/count/procurement-requests?status=COMPLETED",

            ];

            let queryParams: any = {};

            if (router.query.page) {
                queryParams["page"] = router.query.page;
            }
            if (router.query.limit) {
                queryParams["limit"] = router.query.limit;
            }
            if (router.query.search_string) {
                queryParams["search_string"] = router.query.search_string;
            }

            if (router.query.order_by) {
                queryParams["sort_by"] = router.query.order_by;
            }
            if (router.query.order_type) {
                queryParams["sort_type"] = router.query.order_type;
            }
            if (router.query.farm_id) {
                queryParams["farm_id"] = router.query.farm_id;
            }
            // if (router.query.status) {
            //   if (router.query.status !== "ALL") {
            //     queryParams["status"] = router.query.status;
            //   }
            // }

            if (router.query.requested_by) {
                queryParams["requested_by"] = router.query.requested_by
                    ? Array.isArray(router.query.requested_by)
                        ? (router.query.requested_by as string[])
                        : ([router.query.requested_by] as string[])
                    : [];
                // queryParams["created_by"] = userId;
            }

            const paramString = prepareURLEncodedParamsWithArray("", queryParams);
            let responses = await Promise.allSettled(
                urls.map(async (url) => {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}${url}${paramString.replace(
                            "?",
                            "&"
                        )}`,
                        {
                            method: "GET",
                            headers: new Headers({
                                authorization: accessToken,
                            }),
                        }
                    );
                    return response.json();
                })
            );

            const statusTitles = [
                "all",
                "pending",
                "approved",
                "purchased",
                "shipped",
                "delivered",
                "completed"
            ];

            let data = {};
            responses?.map((item: any, index: number) => {
                if (item.status == "fulfilled") {
                    data = { ...data, [statusTitles[index]]: item?.value?.data };
                } else {
                    return 0;
                }
            });
            setCounts(data);
        } catch (err) {
            console.error();
        }
    };

    const getModifiedCount = (count: number) => {
        if (+count >= 100000) {
            let remainder = +count % 100000;
            if (remainder) {
                remainder = Number(String(remainder).slice(0, 2));
                return `${Math.floor(count / 100000)}.${remainder}L`;
            }
            return `${Math.floor(count / 100000)}L`;
        }

        if (+count >= 1000) {
            let remainder = +count % 1000;
            if (remainder) {
                remainder = Number(String(remainder).slice(0, 2));
                return `${Math.floor(count / 1000)}.${remainder}k`;
            }
            return `${Math.floor(count / 1000)}k`;
        }
        return count;
    };

    useEffect(() => {
        if (router.isReady && accessToken) {
            getAllStatsCount();
        }
    }, [router.isReady, accessToken, router.query]);

    return (
        <div className={styles.tabsgroup}>
            <Button
                sx={{ display: "flex", gap: "5px" }}
                className={
                    !router.query.status && !router.query.overdue ? styles.todoButtonActive : styles.todoButton
                }
                onClick={() => onStatusChange("ALL")}
            >
                All
                <Chip
                    className={styles.taskCountChip}
                    label={getModifiedCount(counts["all"])}
                    sx={{
                        height: "20px",

                        // color: !router.query.status ? "#46a845" : "#6a7185",
                        color: "#fff",
                        background: !router.query.status && !router.query.overdue ? "#46a845" : "#6a7185",
                        // border: !router.query.status ? "1px solid #46a845 " : "default",
                    }}
                />
            </Button>
            <Button
                sx={{ display: "flex", gap: "5px" }}
                className={
                    router.query.status === "PENDING"
                        ? styles.todoButtonActive
                        : styles.todoButton
                }
                onClick={() => onStatusChange("PENDING")}
            >
                Pending
                <Chip
                    className={styles.taskCountChip}
                    label={getModifiedCount(counts["pending"])}
                    sx={{
                        height: "20px",

                        // color: router.query.status == "TO-START" ? "#46a845" : "#6a7185",
                        color: "#fff",
                        background:
                            router.query.status == "PENDING" ? "#46a845" : "#6a7185",
                    }}
                />
            </Button>

            <Button
                sx={{ display: "flex", gap: "5px" }}
                className={
                    router.query.status === "APPROVED"
                        ? styles.todoButtonActive
                        : styles.todoButton
                }
                onClick={() => onStatusChange("APPROVED")}
            >
                Approved
                <Chip
                    className={styles.taskCountChip}
                    label={getModifiedCount(counts["approved"])}
                    sx={{
                        height: "20px",

                        // color: router.query.status == "INPROGRESS" ? "#46a845" : "#6a7185",
                        color: "#fff",
                        background:
                            router.query.status == "APPROVED" ? "#46a845" : "#6a7185",
                    }}
                />
            </Button>
            <Button
                sx={{ display: "flex", gap: "5px" }}
                className={
                    router.query.status === "PURCHASED"
                        ? styles.todoButtonActive
                        : styles.todoButton
                }
                onClick={() => onStatusChange("PURCHASED")}
            >
                Purchased
                <Chip
                    className={styles.taskCountChip}
                    label={getModifiedCount(counts["purchased"])}
                    sx={{
                        height: "20px",

                        // color: router.query.status == "DONE" ? "#46a845" : "#6a7185",
                        color: "#fff",
                        background: router.query.status == "PURCHASED" ? "#46a845" : "#6a7185",
                    }}
                />
            </Button>

            <Button
                sx={{ display: "flex", gap: "5px" }}
                className={
                    router.query.status == "SHIPPED"
                        ? styles.todoButtonActive
                        : styles.todoButton
                }
                onClick={() => onStatusChange("SHIPPED")}
            >
                Shipped
                <Chip
                    label={getModifiedCount(counts["shipped"])}
                    className={styles.taskCountChip}
                    sx={{
                        height: "20px",

                        // color: router.query.status == "OVER-DUE" ? "#46a845" : "#6a7185",
                        color: "#fff",
                        background:
                            router.query.status == "SHIPPED" ? "#46a845" : "#6a7185",
                        '&:hover': {
                            background: "#46a845"
                        }
                    }}
                />
            </Button>

            <Button
                sx={{ display: "flex", gap: "5px" }}
                className={
                    router.query.status === "DELIVERED"
                        ? styles.todoButtonActive
                        : styles.todoButton
                }
                onClick={() => onStatusChange("DELIVERED")}
            >
                Delivered
                <Chip
                    className={styles.taskCountChip}
                    label={getModifiedCount(counts["delivered"])}
                    sx={{
                        height: "20px",

                        // color: router.query.status == "DONE" ? "#46a845" : "#6a7185",
                        color: "#fff",
                        background: router.query.status == "DELIVERED" ? "#46a845" : "#6a7185",
                    }}
                />
            </Button>
            <Button
                sx={{ display: "flex", gap: "5px" }}
                className={
                    router.query.status === "COMPLETED"
                        ? styles.todoButtonActive
                        : styles.todoButton
                }
                onClick={() => onStatusChange("COMPLETED")}
            >
                Completed
                <Chip
                    className={styles.taskCountChip}
                    label={getModifiedCount(counts["completed"])}
                    sx={{
                        height: "20px",

                        // color: router.query.status == "DONE" ? "#46a845" : "#6a7185",
                        color: "#fff",
                        background: router.query.status == "COMPLETED" ? "#46a845" : "#6a7185",
                    }}
                />
            </Button>
        </div>
    );
};

export default ProcurementTabs;
