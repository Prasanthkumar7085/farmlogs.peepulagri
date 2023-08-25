import { MenuItem, Select } from "@mui/material"

const SelectComponent = ({ options, ...rest }: any) => {
    return (
        <Select
            {...rest}
        >
            <MenuItem value="">Select Status</MenuItem>
            {options.length && options.map((item: { value: string, title: string }, index: number) => {
                return (
                    <MenuItem key={index} value={item.value}>{item.title}</MenuItem>
                )
            })}

        </Select>
    )
}

export default SelectComponent;
