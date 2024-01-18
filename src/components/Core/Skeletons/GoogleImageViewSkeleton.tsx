import { Skeleton } from "@mui/material";

const GoogleViewSkeleton = () => {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Skeleton variant="rectangular" width={210} height={118} />
            <Skeleton variant="rectangular" width={210} height={118} />
            <Skeleton variant="rectangular" width={210} height={118} />
            <Skeleton variant="rectangular" width={210} height={118} />

        </div>
    )
}
export default GoogleViewSkeleton;