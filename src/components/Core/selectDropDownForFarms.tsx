import { FormControl, MenuItem, Select } from "@mui/material"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import FarmDetailsMiniCard from "../AddLogs/farm-details-mini-card";
import FarmDetailsCard from "../TimeLine/FarmDetailsCard";

const SelectComponenentForFarms = ({ loading, setDefaultValue, options, captureFarmName, defaultValue, ...rest }: any) => {

    const router = useRouter();

    const [statusOptions, setStatusOptions] = useState<any>();
    const [farmOptions, setFarmOptions] = useState<any>()

    let handleStatusChange = (event: any) => {

        let selectedOption = event.target.value;
        let selectedObject = options.find((item: any) => item.title == selectedOption);
        setStatusOptions(selectedObject);
        captureFarmName(selectedObject);

    }





    return (
        <FormControl
            size="small"
            sx={{
                // position: "sticky",
                // top: "px",
                width: "100%",
                // zIndex: "150",
                textAlign: "center",
                '& .MuiInputBase-root': {
                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                    border: "none",
                },

                '& .MuiSelect-nativeInput': {
                    opacity: "1",
                    bottom: "inherit",
                    padding: "8px 3px 8px 8px",
                    border: "1px solid rgba(0, 0, 0, 0.231372549) !important",
                    borderRadius: "4px",
                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                    height: "35px",
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: "none !important"
                }
            }}

        >

            <Select
                {...rest}
                value={statusOptions?.title ? statusOptions?.title : defaultValue}
                onChange={handleStatusChange}
                fullWidth
            >

                {options?.length && options.map((item: any, index: number) => {
                    return (
                        <MenuItem value={item.title} key={index}>
                            {item.title}
                        </MenuItem>
                    )
                })}

            </Select>
        </FormControl>
    )
}
export default SelectComponenentForFarms