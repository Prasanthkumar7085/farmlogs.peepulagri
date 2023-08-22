import ButtonComponent from "../Core/ButtonComponent";
import SearchComponent from "../Core/SearchComponent";
import AddIcon from '@mui/icons-material/Add';
import SupportDataTable from "./SupportDataTable";
import { useRouter } from "next/router";

const SupportPage = () => {

    const router = useRouter();

    const onChange = (value: string) => {
        console.log(value);
    }


    return (
        <div style={{ margin: "30px 30px 0px 30px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>Support</h3>
                <div style={{ display: "flex", justifyContent: "space-around", width: "500px" }}>
                    <SearchComponent onChange={onChange} />
                    <ButtonComponent icon={<AddIcon />} title='ADD' onClick={() => router.push('/support/add')} />
                </div>
            </div>
            <SupportDataTable />
        </div>
    )
}


export default SupportPage;