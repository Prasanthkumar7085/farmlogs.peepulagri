import { Backdrop, CircularProgress } from "@mui/material";

const LoadingComponent = ({ loading }: { loading: Boolean }) => {
    return (
        <Backdrop
            sx={{ display: "flex", gap: "10px", flexDirection: "column", color: "#0088d1", backgroundColor: "rgba(256, 256, 256, 0.5)", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
            open={Boolean(loading)}
        >
            <CircularProgress />
            Loading...
        </Backdrop>
    )
}
export default LoadingComponent;