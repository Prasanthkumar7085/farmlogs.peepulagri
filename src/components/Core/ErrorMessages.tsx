import { Typography } from "@mui/material";

const ErrorMessages = ({ errorMessages, keyname }: any) => {
    return (
        <Typography variant='subtitle1' color="error" sx={{ height: "5vh" }}>
            {errorMessages[keyname]}
        </Typography>
    )
}
export default ErrorMessages;