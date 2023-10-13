import { Box, Skeleton } from "@mui/material";

const SkeletonLoadingForAttachments = () => {
  return (
    <div style={{ marginRight: "120px" }}>
      <Box sx={{ width: 300 }}>
        <div style={{ display: "flex" }}>
          <Skeleton variant="circular" width={40} height={40} />
          <div style={{ display: "block" }}>
            <Skeleton width={150} height={20} />
            <Skeleton animation="wave" width={250} height={20} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton animation="wave" width={100} height={20} />
          <Skeleton animation="wave" width={100} height={20} />
        </div>
      </Box>
      <Box sx={{ width: 300, marginTop: "30px" }}>
        <div style={{ display: "flex" }}>
          <Skeleton variant="circular" width={40} height={40} />
          <div style={{ display: "block" }}>
            <Skeleton width={150} height={20} />
            <Skeleton animation="wave" width={250} height={20} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Skeleton animation="wave" width={100} height={20} />
          <Skeleton animation="wave" width={100} height={20} />
        </div>
      </Box>
    </div>
  );
};

export default SkeletonLoadingForAttachments;
