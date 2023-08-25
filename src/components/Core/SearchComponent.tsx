import { TextField } from "@mui/material";

const SearchComponent = (props: any) => {
    const { onChange, ...rest } = props;

    return (
        <TextField onChange={(e: any) => onChange(e.target.value)}  {...rest} />
    )
}

export default SearchComponent;