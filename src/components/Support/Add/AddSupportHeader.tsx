import ButtonComponent from "@/components/Core/ButtonComponent";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";

const AddSupportHeader = () => {
  const router = useRouter();
  return (
    <div
        style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBlock: "1rem",
        columnGap: "1rem"
    }}
    >
    <ButtonComponent
        direction={false}
        icon={<ArrowBackIcon />}
        size="small"
        onClick={() => router.replace('/support')}
        style= {{ paddingInline : "0", minWidth: "auto" }}
    />
      <Typography variant="h6" className="title">{router.query.support_id ? 'Edit Support' : 'Add Support'}</Typography>
    </div>
  );
};

export default AddSupportHeader;
