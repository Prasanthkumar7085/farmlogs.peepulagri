import { Typography } from "@mui/material";

const ErrorMessages = ({ errorMessages, keyname }: any) => {
    return (
        <Typography color="error" sx={{ lineHeight: "100%", marginBlock: "4px", fontSize: "12px" }}>
            {errorMessages[keyname]}
        </Typography>
    )
}
export default ErrorMessages;