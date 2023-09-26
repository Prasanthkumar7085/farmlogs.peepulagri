import { useRouter } from "next/router";
import DashBoardHeader from "./dash-board-header";
import FarmCard from "./farm-card";

const DashboardPage = () => {
    const router = useRouter()
    return (
        <div id="dashboardPage">
            <DashBoardHeader />
            <FarmCard />
            <div className="addFormPositionIcon">
                <img src="/add-form-icon.svg" alt="" onClick={() => router.push("/scouting/forms/add")} />
            </div>
        </div>
    );
}

export default DashboardPage;