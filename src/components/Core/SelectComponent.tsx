import { FormControl, MenuItem, Select } from "@mui/material"
import { useState } from "react";

const SelectComponenent = ({ options, captureFormName }: any) => {


    const [statusOptions, setStatusOptions] = useState<any>();

    let handleStatusChange = (event: any) => {

        setStatusOptions(event.target.value);
        captureFormName(event.target.value)
    }


    return (
        <FormControl
            size="small"
            sx={{
                width: "100%",

                '& .MuiInputBase-root': {
                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                    fontFamily: "'IBM plex sans', sans-serif",
                    backgroundColor: "brown",
                    border: "none",
                    width: "15%",
                },

                '& .MuiSelect-nativeInput': {
                    opacity: "1",
                    bottom: "inherit",
                    padding: "8px 3px 8px 8px",
                    border: "1px solid rgba(0, 0, 0, 0.231372549) !important",
                    borderRadius: "5px",
                    fontSize: "clamp(.875rem, 1vw, 1.125rem)",
                    minHeight: "40px",
                    maxHeight: "40px",
                },
                '& .MuiOutlinedInput-notchedOutline': {
                    border: "none !important"
                }
            }}

        >

            <Select
                value={statusOptions}
                onChange={handleStatusChange}
                sx={{ width: "150px" }}
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
export default SelectComponenent