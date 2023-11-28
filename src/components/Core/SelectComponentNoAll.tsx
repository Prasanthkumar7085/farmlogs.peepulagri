import { MenuItem, Select } from "@mui/material";

const SelectComponentNoAll = ({ options, ...rest }: any) => {
  return (
    <Select
      size="small"
      sx={{
        width: "100%",
        background: "#fff",
      }}
      displayEmpty
      {...rest}
    >
      {options?.length &&
        options.map((item: { value: string; title: string }, index: number) => {
          return (
            <MenuItem key={index} value={item.value}>
              {item.title}
            </MenuItem>
          );
        })}
    </Select>
  );
};

export default SelectComponentNoAll;
