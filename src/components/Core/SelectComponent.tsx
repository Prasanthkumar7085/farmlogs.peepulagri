import { MenuItem, Select } from "@mui/material"
import { useRouter } from "next/router"

const SelectComponent = ({ options, ...rest }: any) => {

    const router = useRouter();
    return (
        <Select
            size="small"
            sx={{
                width: "100%",
                background: "#fff",
                color: "#6A7185", fontWeight: "300", fontFamily: "'Inter',sans-serif",
                '& .MuiSelect-select': {
                    fontSize: "clamp(.75rem, 0.72vw, 1rem)",
                    paddingBlock: "8px !important"

                }
            }}
            displayEmpty
            {...rest}
        >
            {!router.query.support_id ? <MenuItem value="">
                <b>{'All'}</b>
            </MenuItem> : ""}

            {options?.length && options.map((item: { value: string, title: string }, index: number) => {
                return (
                    <MenuItem key={index} value={item.value}>{item.title}</MenuItem>
                )
            })}

        </Select>
    )
}

export default SelectComponent;
