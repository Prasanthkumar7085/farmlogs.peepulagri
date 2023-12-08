import AllSummaryComponents from "@/components/Scouting/Crops/Summary/AllSummaryComponent";
import Header1 from "@/components/Scouting/Header/HeaderComponent";


const SummaryPage = () => {

    return (
        <div>
            <Header1 name={"Day Summary"} />
            <AllSummaryComponents />
        </div>
    )
}
export default SummaryPage;