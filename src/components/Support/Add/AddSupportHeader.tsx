import ButtonComponent from "@/components/Core/ButtonComponent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/router";


const AddSupportHeader = () => {
    const router = useRouter();
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ButtonComponent direction={false} variant={'outlined'} icon={<ArrowBackIcon />} title='Back' onClick={() => router.back()} />
                Add Support
            </div>
        </div>
    )
}

export default AddSupportHeader;