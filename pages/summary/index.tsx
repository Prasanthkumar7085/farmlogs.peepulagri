import AllSummaryComponents from "@/components/Scouting/Crops/Summary/AllSummaryComponent";
import Header1 from "@/components/Scouting/Header/HeaderComponent";


const SummaryPage = () => {

    return (
        <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            {/* <Header1 name={"Day Summary"} /> */}
            <AllSummaryComponents />
        </div>
    )
}
export default SummaryPage;