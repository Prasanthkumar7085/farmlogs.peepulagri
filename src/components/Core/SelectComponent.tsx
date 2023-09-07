import { MenuItem, Select } from "@mui/material"
import { useRouter } from "next/router"

const SelectComponent = ({ options, ...rest }: any) => {

    const router = useRouter();
    return (
        <Select
            displayEmpty
            {...rest}
            // label={router.query.support_id ? "" : "Select Status"}
        >
            <MenuItem value="">
                <em>{router.query.support_id ? 'Change Status' : 'All'}</em>
            </MenuItem>

            {options.length && options.map((item: { value: string, title: string }, index: number) => {
                return (
                    <MenuItem key={index} value={item.value}>{item.title}</MenuItem>
                )
            })}

        </Select>
    )
}

export default SelectComponent;
