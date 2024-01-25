import { Typography } from "@mui/material";

const ErrorMessages = ({ errorMessages, keyname }: any) => {
    return (
        <Typography color="error" sx={{ lineHeight: "100%", marginBlock: errorMessages ? "4px" : "0px", fontSize: "12px", fontFamily: "'Inter', sans-serif", display: errorMessages[keyname] ? "block" : "none" }}>
            {errorMessages[keyname]}
        </Typography>
    )
}
export default ErrorMessages;