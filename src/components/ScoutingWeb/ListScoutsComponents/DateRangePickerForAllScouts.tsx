import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DateRangePicker, Stack } from "rsuite";
import "rsuite/dist/rsuite.css";

interface pageProps {
  onDateFilterChange: (date1: string, date2: string) => void;
}

const DateRangePickerForAllScouts = ({ onDateFilterChange }: pageProps) => {
  const router = useRouter();

  const [fromDefaultDate, setFromDefaultDate] = useState<any>();
  const [toDefaultDate, setToDefaultDate] = useState<any>();

  useEffect(() => {
    if (router.isReady) {
      if (router.query.from_date && router.query.to_date) {
        setFromDefaultDate(new Date(router.query.from_date as string));
        setToDefaultDate(new Date(router.query.to_date as string));
      } else {
        setFromDefaultDate(null);
        setToDefaultDate(null);
      }
    }
  }, [router.isReady, router.query.from_date, router.query.to_date]);
  return (
    <div >
      <Stack style={{ width: "100%" }}>
        <DateRangePicker
          style={{ width: "100%" }}
          disabledDate={(date: any) => {
            return date.getTime() > new Date().getTime();
          }}
          value={(fromDefaultDate && toDefaultDate) ? [fromDefaultDate, toDefaultDate] : null}
          showOneCalendar
          format="dd-MM-yyyy"
          placeholder={"dd-mm-yyyy ~ dd-mm-yyyy"}
          size="md"
          onChange={(newDate: any) => {
            if (newDate) {
              let date1 = new Date(
                moment(new Date(newDate[0])).format("YYYY-MM-DD")
              )
                .toISOString()
                .substring(0, 10);
              let date2 = new Date(
                moment(new Date(newDate[1])).format("YYYY-MM-DD")
              )
                .toISOString()
                .substring(0, 10);
              onDateFilterChange(date1, date2);
            } else {
              onDateFilterChange("", "");
            }
          }}
        />
      </Stack>
    </div>
  );
};

export default DateRangePickerForAllScouts;
