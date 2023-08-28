import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Clear from "@mui/icons-material/Clear";
import { IconButton, InputAdornment, TextField } from "@mui/material";

const SearchComponent = (props: any) => {
    const { onChange, searchString, setSearchString, ...rest } = props;

    return (
        <TextField
            onChange={(e: any) => onChange(e.target.value)}
            {...rest}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchOutlined />
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        {searchString ? <IconButton onClick={() => { setSearchString; onChange('') }}>   <Clear /> </IconButton> : ""}
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default SearchComponent;