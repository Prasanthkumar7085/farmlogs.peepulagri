import { Button, Chip } from "@mui/material";
import { useRouter } from "next/router";
import styles from "./tabs.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Tabs = ({ onStatusChange }: { onStatusChange: (value: any) => void }) => {
  const router = useRouter();

  const accessToken = useSelector(
    (state: any) => state.auth.userDetails?.access_token
  );

  const [counts, setCounts] = useState<any>({});

  const getAllStatsCount = async () => {
    try {
      let urls = [
        "/tasks/status/count/stats",
        "/tasks/status/count/stats?status=TO-START",
        "/tasks/status/count/stats?status=INPROGRESS",
        "/tasks/status/count/stats?status=DONE",
        "/tasks/status/count/stats?status=PENDING",
        "/tasks/status/count/stats?status=OVER-DUE",
      ];

      let responses = await Promise.allSettled(
        urls.map(async (url) => {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${url}`,
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
        "to_start",
        "inprogress",
        "done",
        "pending",
        "overdue",
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
        remainder = Number(String(remainder)[0]);
        return `${Math.floor(count / 100000)}.${remainder}k`;
      }
      return `${Math.floor(count / 100000)}k`;
    }

    if (+count >= 1000) {
      let remainder = +count % 1000;
      if (remainder) {
        remainder = Number(String(remainder)[0]);
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
  }, [router.isReady, accessToken]);

  return (
    <div className={styles.tabsgroup}>
      <Button
        sx={{ display: "flex", gap: "5px" }}
        className={
          !router.query.status ? styles.todoButtonActive : styles.todoButton
        }
        onClick={() => onStatusChange("ALL")}
      >
        All
        <Chip
          label={getModifiedCount(counts["all"])}
          sx={{
            height: "15px",

            // color: !router.query.status ? "#46a845" : "#6a7185",
            color: "#fff",
            background: !router.query.status ? "#46a845" : "#6a7185",
            // border: !router.query.status ? "1px solid #46a845 " : "default",
          }}
        />
      </Button>
      <Button
        sx={{ display: "flex", gap: "5px" }}
        className={
          router.query.status === "TO-START"
            ? styles.todoButtonActive
            : styles.todoButton
        }
        onClick={() => onStatusChange("TO-START")}
      >
        To Start
        <Chip
          label={getModifiedCount(counts["to_start"])}
          sx={{
            height: "15px",

            // color: router.query.status == "TO-START" ? "#46a845" : "#6a7185",
            color: "#fff",
            background:
              router.query.status == "TO-START" ? "#46a845" : "#6a7185",
          }}
        />
      </Button>

      <Button
        sx={{ display: "flex", gap: "5px" }}
        className={
          router.query.status === "INPROGRESS"
            ? styles.todoButtonActive
            : styles.todoButton
        }
        onClick={() => onStatusChange("INPROGRESS")}
      >
        Inprogress
        <Chip
          label={getModifiedCount(counts["inprogress"])}
          sx={{
            height: "15px",

            // color: router.query.status == "INPROGRESS" ? "#46a845" : "#6a7185",
            color: "#fff",
            background:
              router.query.status == "INPROGRESS" ? "#46a845" : "#6a7185",
          }}
        />
      </Button>
      <Button
        sx={{ display: "flex", gap: "5px" }}
        className={
          router.query.status === "DONE"
            ? styles.todoButtonActive
            : styles.todoButton
        }
        onClick={() => onStatusChange("DONE")}
      >
        Done
        <Chip
          label={getModifiedCount(counts["done"])}
          sx={{
            height: "15px",

            // color: router.query.status == "DONE" ? "#46a845" : "#6a7185",
            color: "#fff",
            background: router.query.status == "DONE" ? "#46a845" : "#6a7185",
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
          label={getModifiedCount(counts["pending"])}
          sx={{
            height: "15px",

            // color: router.query.status == "PENDING" ? "#46a845" : "#6a7185",
            color: "#fff",
            background:
              router.query.status == "PENDING" ? "#46a845" : "#6a7185",
          }}
        />
      </Button>
      <Button
        sx={{ display: "flex", gap: "5px" }}
        className={
          router.query.status === "OVER-DUE"
            ? styles.todoButtonActive
            : styles.todoButton
        }
        onClick={() => onStatusChange("OVER-DUE")}
      >
        Overdue
        <Chip
          label={getModifiedCount(counts["overdue"])}
          sx={{
            height: "15px",

            // color: router.query.status == "OVER-DUE" ? "#46a845" : "#6a7185",
            color: "#fff",
            background:
              router.query.status == "OVER-DUE" ? "#46a845" : "#6a7185",
          }}
        />
      </Button>
    </div>
  );
};

export default Tabs;
