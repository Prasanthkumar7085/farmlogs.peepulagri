import DashBoardHeader from "./dash-board-header";
import FarmCard from "./farm-card";

const DashboardPage = () => {
    return (
        <div id="dashboardPage">
            <DashBoardHeader />
            <FarmCard />
            <div className="addFormPositionIcon">
                <img src="/add-form-icon.svg" alt="" />
            </div>
        </div>
    );
}

export default DashboardPage;